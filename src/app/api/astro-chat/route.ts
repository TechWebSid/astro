import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  sender: 'user' | 'astro';
  text: string;
}

interface PlanetSummary {
  name: string;
  signName: string;
  house: number;
  degreeFormatted: string;
  nakshatraName: string;
  pada: number;
  isRetrograde: boolean;
}

interface KundliPayload {
  name: string;
  gender: string;
  dob: string;
  tob: string;
  cityName: string;
  ascendant: {
    signName: string;
    signLord: string;
    degreeFormatted: string;
  };
  moonNakshatra: {
    name: string;
    lord: string;
    pada: number;
  };
  planets: PlanetSummary[];
  currentMahadasha?: {
    planet: string;
    startDate: string;
    endDate: string;
  };
  currentAntardasha?: {
    planet: string;
    startDate: string;
    endDate: string;
  };
  doshas?: {
    manglik: string;
    kaalSarp: string;
    sadeSati: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'Replicate API token is not configured on the server.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      astrologerName,
      astrologerTitle,
      astrologerSkills,
      kundli,
      messages,
      userMessage
    }: {
      astrologerName: string;
      astrologerTitle: string;
      astrologerSkills: string[];
      kundli: KundliPayload;
      messages: ChatMessage[];
      userMessage: string;
    } = body;

    if (!userMessage || !kundli) {
      return NextResponse.json(
        { error: 'User message and Kundli data are required.' },
        { status: 400 }
      );
    }

    const planetsText = kundli.planets
      .map(
        (p) =>
          `- ${p.name}: ${p.signName} in House ${p.house} (${p.degreeFormatted}), Nakshatra ${p.nakshatraName} Pada ${p.pada}${p.isRetrograde ? ' [Retrograde]' : ''}`
      )
      .join('\n');

    const systemPrompt = `You are ${astrologerName} (${astrologerTitle}), a senior Vedic astrologer at Astro Aashutosh Divyadarshi.
Your specialties: ${astrologerSkills.join(', ')}.

CRITICAL ACCURACY RULES:
1. You MUST analyze ONLY the exact verified birth chart provided below. NEVER recalculate, guess, or contradict the Lagna, houses, signs, degrees, or Dashas given here.
2. Always ground your answer in the user's actual chart: mention their Lagna, relevant house (e.g., 7th for marriage, 10th for career, 2nd/11th for wealth, 5th for love/children), the planet(s) sitting in or ruling that house, and their exact running Mahadasha & Antardasha dates.
3. Be warm, deeply insightful, honest, and practical — like an authentic experienced Jyotish Acharya, never generic.
4. Keep your response clear and well-structured (2–3 concise paragraphs, plus 1 simple classical Vedic remedy if helpful). Do not use markdown headers (#); bold key terms sparingly.

VERIFIED JANAM KUNDLI (LAHIRI AYANAMSA):
- Native: ${kundli.name} (${kundli.gender})
- Birth: ${kundli.dob} at ${kundli.tob} in ${kundli.cityName}
- Ascendant (Lagna): ${kundli.ascendant.signName} (${kundli.ascendant.degreeFormatted}), Lagna Lord: ${kundli.ascendant.signLord}
- Birth Nakshatra: ${kundli.moonNakshatra.name} (Pada ${kundli.moonNakshatra.pada}, Lord: ${kundli.moonNakshatra.lord})
- Current Mahadasha: ${kundli.currentMahadasha ? `${kundli.currentMahadasha.planet} (${kundli.currentMahadasha.startDate} to ${kundli.currentMahadasha.endDate})` : 'Not specified'}
- Current Antardasha: ${kundli.currentAntardasha ? `${kundli.currentAntardasha.planet} (${kundli.currentAntardasha.startDate} to ${kundli.currentAntardasha.endDate})` : 'Not specified'}
- Doshas: Manglik: ${kundli.doshas?.manglik || 'None'} | Kaal Sarp: ${kundli.doshas?.kaalSarp || 'None'} | Sade Sati: ${kundli.doshas?.sadeSati || 'Not Active'}

PLANETARY POSITIONS (D1 LAGNA CHART):
${planetsText}`;

    // Build recent conversation transcript for context
    const recentHistory = (messages || [])
      .slice(-8)
      .map((m) => `${m.sender === 'user' ? 'User' : astrologerName}: ${m.text}`)
      .join('\n');

    const prompt = recentHistory
      ? `Previous conversation:\n${recentHistory}\n\nUser's new question: ${userMessage}\n\nRespond directly as ${astrologerName} analyzing their exact Kundli above:`
      : `User's question: ${userMessage}\n\nRespond directly as ${astrologerName} analyzing their exact Kundli above:`;

    const createRes = await fetch(
      'https://api.replicate.com/v1/models/meta/meta-llama-3-70b-instruct/predictions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Prefer: 'wait'
        },
        body: JSON.stringify({
          input: {
            system_prompt: systemPrompt,
            prompt,
            max_tokens: 650,
            temperature: 0.35,
            top_p: 0.9
          }
        })
      }
    );

    if (!createRes.ok) {
      const errText = await createRes.text();
      return NextResponse.json(
        { error: `Replicate API error: ${createRes.status}`, details: errText },
        { status: 502 }
      );
    }

    let prediction = await createRes.json();

    // Poll if Replicate is still processing after Prefer: wait
    let attempts = 0;
    while (
      (prediction.status === 'starting' || prediction.status === 'processing') &&
      prediction.urls?.get &&
      attempts < 20
    ) {
      await new Promise((r) => setTimeout(r, 1200));
      const pollRes = await fetch(prediction.urls.get, {
        headers: { Authorization: `Bearer ${token}` }
      });
      prediction = await pollRes.json();
      attempts++;
    }

    if (prediction.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Astrologer response timed out or failed.', status: prediction.status },
        { status: 504 }
      );
    }

    const replyText = Array.isArray(prediction.output)
      ? prediction.output.join('').trim()
      : String(prediction.output || '').trim();

    return NextResponse.json({ reply: replyText });
  } catch (err) {
    console.error('Astro Chat API Error:', err);
    return NextResponse.json(
      { error: 'Internal server error while consulting astrologer.' },
      { status: 500 }
    );
  }
}
