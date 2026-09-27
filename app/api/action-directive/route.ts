import { NextResponse } from "next/server";

// Expert Botanical Action Directives Map (Gemini Disabled)
const BOTANICAL_DIRECTIVES: Record<string, { severity: string; actionDirective: string }> = {
  "potato___early_blight": {
    severity: "Moderate (Level 2)",
    actionDirective: "Apply Chlorothalonil or copper-based fungicide every 7-10 days and prune lower infected leaves."
  },
  "potato___late_blight": {
    severity: "Critical (Level 4)",
    actionDirective: "Immediately apply systemic fungicide (Mancozeb/Copper) and reduce overhead irrigation to halt sporangia spread."
  },
  "potato___healthy": {
    severity: "None (Level 0)",
    actionDirective: "Continue standard watering and nutrient schedule. Crop foliage exhibits robust physiological health."
  },
  "tomato_early_blight": {
    severity: "Moderate (Level 2)",
    actionDirective: "Apply liquid copper fungicide to lower foliage and mulch soil base to prevent fungal spore splash."
  },
  "tomato_late_blight": {
    severity: "Critical (Level 4)",
    actionDirective: "Destroy severely infected stems immediately and spray broad-spectrum copper bactericide across field."
  },
  "tomato_leaf_mold": {
    severity: "High (Level 3)",
    actionDirective: "Increase greenhouse ventilation and apply bio-fungicide containing Bacillus subtilis."
  },
  "tomato_septoria_leaf_spot": {
    severity: "High (Level 3)",
    actionDirective: "Remove spot-infested lower leaves and apply organic copper fungicide at first sign of lesions."
  },
  "tomato_bacterial_spot": {
    severity: "High (Level 3)",
    actionDirective: "Spray copper hydroxide mixed with Mancozeb and avoid overhead handling when foliage is wet."
  },
  "tomato_yellow_leaf_curl_virus": {
    severity: "High (Level 3)",
    actionDirective: "Deploy yellow sticky traps and apply insecticidal soap to control whitefly vector populations."
  },
  "tomato_spider_mites": {
    severity: "Low (Level 1)",
    actionDirective: "Apply neem oil or miticide spray to leaf undersides and increase ambient humidity levels."
  },
  "tomato_healthy": {
    severity: "None (Level 0)",
    actionDirective: "Continue current crop management. Foliage demonstrates optimal photosynthetic vigor and zero pathogen signs."
  }
};

export async function POST(req: Request) {
  try {
    const { pathogen } = await req.json();

    if (!pathogen) {
      return NextResponse.json({
        severity: "Unknown",
        actionDirective: "No pathogen specified. Upload a crop scan image."
      });
    }

    const key = pathogen.toLowerCase().trim();

    // Direct lookup
    if (BOTANICAL_DIRECTIVES[key]) {
      return NextResponse.json(BOTANICAL_DIRECTIVES[key]);
    }

    // Partial key matching
    for (const [dictKey, directive] of Object.entries(BOTANICAL_DIRECTIVES)) {
      if (key.includes(dictKey) || dictKey.includes(key)) {
        return NextResponse.json(directive);
      }
    }

    if (key.includes("healthy") || key.includes("none")) {
      return NextResponse.json({
        severity: "None (Level 0)",
        actionDirective: "Continue standard watering and nutrient schedule. No pathological intervention required."
      });
    }

    // Default fallback directive
    return NextResponse.json({
      severity: "Moderate (Level 2)",
      actionDirective: `Inspect ${pathogen} foliage carefully and apply a protective organic copper-based fungicide.`
    });

  } catch (error) {
    console.error("Action Directive Route Error:", error);
    return NextResponse.json({
      severity: "Moderate (Level 2)",
      actionDirective: "Inspect crop foliage for lesions and apply organic protective fungicide."
    });
  }
}
