/* ----- BEARING MODULE ----- */
window.QS_MODULES.push({
  id: "bearing",
  name: "Bearing",
  searchWords: ["BEARINGS"],
  notAScrewWords: [
    "HOUSING", "PLUMMER", "PILLOW", "BUSH", "BUSHING", "PULLER", "GREASE",
    "HEATER", "SLEEVE", "ADAPTER", "NUT", "WASHER", "SEAL", "BLOCK"
  ],
  tileBg: "#D2F2E6",
  tileColor: "#0D3A2F",
  iconSvg:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="9"></circle>' +
      '<circle cx="12" cy="12" r="4"></circle>' +
      '<circle cx="12" cy="5.5" r="1.2"></circle>' +
      '<circle cx="18.5" cy="12" r="1.2"></circle>' +
      '<circle cx="12" cy="18.5" r="1.2"></circle>' +
      '<circle cx="5.5" cy="12" r="1.2"></circle>' +
    '</svg>',

  /* SAP export defaults for Bearing */
  exportDefaults: {
    materialType: "ERSA",
    baseUnit: "EA",
    materialGroup: "Mechanical"
  },

  /* Easy-to-edit Bearing dropdown lists */
  lists: {
    numberKind: ["ISO number", "Part number"],
    suffix: ["2Z", "2RS", "C3", "K"],
    brand: ["SKF", "FAG", "NSK", "KOYO"],
    drawingType: [
      "Auto",
      "Ball",
      "Cylindrical roller",
      "Tapered roller",
      "Spherical roller",
      "Thrust ball",
      "Needle roller",
      "Neutral"
    ]
  },

  /* Easy-to-edit rules to detect Bearing type & drawing family from ISO number */
  typeRules: {
    prefixRules: [
      { prefixes: ["HMK", "RNA", "NKI", "HK", "NK", "NA", "BK"], label: "Needle roller", family: "needle" },
      { prefixes: ["NNCF", "NNU", "NUP", "NU", "NJ", "NF", "NN", "NCF", "N"], label: "Cylindrical roller", family: "cylindrical" }
    ],
    digitRules: [
      { length: 3, startsWith: ["6"], label: "Deep groove ball", family: "ball" },
      { length: [4, 5], startsWith: ["6"], label: "Deep groove ball", family: "ball" },
      { length: 5, startsWith: ["16"], label: "Deep groove ball", family: "ball" },
      { length: 4, startsWith: ["7"], label: "Angular contact ball", family: "ball" },
      { length: 4, startsWith: ["12", "13"], label: "Self-aligning ball", family: "ball" },
      { length: 4, startsWith: ["22", "23"], label: "Self-aligning ball", family: "ball" },
      { length: 4, startsWith: ["32", "33"], label: "Double row angular contact ball", family: "ball" },
      { length: 5, startsWith: ["20", "21", "22", "23", "24"], label: "Spherical roller", family: "spherical" },
      { length: 5, startsWith: ["30", "31", "32", "33"], label: "Tapered roller", family: "tapered" },
      { length: 5, startsWith: ["51", "52", "53", "54"], label: "Thrust ball", family: "thrust" }
    ]
  },

  /* Detect bearing type label and drawing family from number kind and bearing number */
  detectBearingType: function (numberKind, bearingNumber) {
    const kind = String(numberKind || "").trim().toLowerCase();
    const cleaned = String(bearingNumber || "").toUpperCase().replace(/[\s-]+/g, "");
    if (kind === "part number" || !cleaned) {
      return { label: "not recognized", family: "none" };
    }

    const rules = this.typeRules || {};
    const prefixRules = Array.isArray(rules.prefixRules) ? rules.prefixRules : [];
    for (let i = 0; i < prefixRules.length; i++) {
      const rule = prefixRules[i];
      for (let p = 0; p < rule.prefixes.length; p++) {
        const prefix = rule.prefixes[p];
        if (cleaned.indexOf(prefix) === 0 && /^\d/.test(cleaned.slice(prefix.length))) {
          return { label: rule.label, family: rule.family };
        }
      }
    }

    const digitMatch = cleaned.match(/^(\d+)/);
    if (!digitMatch) {
      return { label: "not recognized", family: "none" };
    }
    const digits = digitMatch[1];
    const len = digits.length;

    const digitRules = Array.isArray(rules.digitRules) ? rules.digitRules : [];
    for (let j = 0; j < digitRules.length; j++) {
      const dRule = digitRules[j];
      const lenOk = Array.isArray(dRule.length)
        ? dRule.length.indexOf(len) !== -1
        : dRule.length === len;
      if (!lenOk) continue;

      for (let s = 0; s < dRule.startsWith.length; s++) {
        if (digits.indexOf(dRule.startsWith[s]) === 0) {
          return { label: dRule.label, family: dRule.family };
        }
      }
    }

    return { label: "not recognized", family: "none" };
  },

  /* Easy-to-edit steel & seal colors for the drawing */
  drawingColors: {
    steelFill: "#E8EEF4",
    steelShade: "#CBD5E1",
    steelDark: "#94A3B8",
    steelStroke: "#334155",
    ballLight: "#F8FAFC",
    ballDark: "#94A3B8",
    rubberFill: "#374151",
    rubberStroke: "#111827"
  },

  /* Easy-to-edit plain-word meanings for Long text */
  meanings: {
    suffix: {
      "2Z": "two metal shields",
      "2RS": "two rubber seals",
      "C3": "radial clearance larger than normal",
      "K": "tapered bore"
    }
  },

  /* Build SAP Short Text (max 40 chars, UPPERCASE, no commas) */
  buildShortText: function (values) {
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const upper = function (v) {
      return clean(v).toUpperCase();
    };
    const resolveChoice = function (choice, otherVal) {
      if (choice === "__OTHER__") return upper(otherVal);
      return upper(choice);
    };

    const numberKind = clean(values.numberKind) || "ISO number";
    const bearingNumber = upper(values.bearingNumber);
    const rawSuffixes = [
      resolveChoice(values.suffix1, values.suffix1Other),
      resolveChoice(values.suffix2, values.suffix2Other),
      resolveChoice(values.suffix3, values.suffix3Other)
    ];
    const brand = resolveChoice(values.brand, values.brandOther);

    const suffixes = [];
    const seen = {};
    rawSuffixes.forEach(function (s) {
      if (s && !seen[s]) {
        seen[s] = true;
        suffixes.push(s);
      }
    });

    const hasAnyField = Boolean(
      numberKind !== "ISO number" ||
      bearingNumber ||
      suffixes.length > 0 ||
      brand
    );
    if (!hasAnyField) {
      return "";
    }

    const numPart = numberKind === "Part number"
      ? ("P/N: " + (bearingNumber || "?"))
      : (bearingNumber || "?");

    return ["BEARING", numPart].concat(suffixes).concat(brand ? [brand] : [])
      .filter(Boolean)
      .join(" ");
  },

  /* Build plain-word Long Text from current values and meanings */
  buildLongText: function (values) {
    const mod = this;
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const upper = function (v) {
      return clean(v).toUpperCase();
    };
    const resolveChoice = function (choice, otherVal) {
      if (choice === "__OTHER__") return upper(otherVal);
      return upper(choice);
    };

    const numberKind = clean(values.numberKind) || "ISO number";
    const bearingNumber = upper(values.bearingNumber);
    const rawSuffixes = [
      resolveChoice(values.suffix1, values.suffix1Other),
      resolveChoice(values.suffix2, values.suffix2Other),
      resolveChoice(values.suffix3, values.suffix3Other)
    ];
    const brand = resolveChoice(values.brand, values.brandOther);

    const suffixes = [];
    const seen = {};
    rawSuffixes.forEach(function (s) {
      if (s && !seen[s]) {
        seen[s] = true;
        suffixes.push(s);
      }
    });

    const hasAnyField = Boolean(
      numberKind !== "ISO number" ||
      bearingNumber ||
      suffixes.length > 0 ||
      brand
    );
    if (!hasAnyField) {
      return "";
    }

    const lead = numberKind === "Part number"
      ? ("Bearing part number" + (bearingNumber ? (" " + bearingNumber) : ""))
      : ("Bearing number" + (bearingNumber ? (" " + bearingNumber) : ""));

    const suffixPhrases = suffixes.map(function (code) {
      const meaning = (mod.meanings && mod.meanings.suffix && mod.meanings.suffix[code])
        ? mod.meanings.suffix[code]
        : "";
      return meaning ? (meaning + " (" + code + ")") : code;
    });

    let sentence = lead;
    if (suffixPhrases.length > 0) {
      sentence += " with " + suffixPhrases.join(", ");
    }
    if (brand) {
      sentence += ", brand " + brand;
    }
    return sentence + ".";
  },

  /* Find which Required fields are still empty */
  getMissingRequired: function (values) {
    const missing = [];
    if (!String(values.numberKind || "").trim()) missing.push("Number kind");
    if (!String(values.bearingNumber || "").trim()) missing.push("Bearing number");
    return missing;
  },

  /* Build crisp steel-colored front + section SVG drawing across 7 bearing families */
  buildDrawingSvg: function (values, shortNameText) {
    const mod = this;
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const upper = function (v) {
      return clean(v).toUpperCase();
    };
    const esc = function (s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    };
    const resolveChoice = function (choice, otherVal) {
      if (choice === "__OTHER__") return upper(otherVal);
      return upper(choice);
    };
    const wrapLines = function (text, maxChars) {
      const str = clean(text);
      if (!str) return [];
      const words = str.split(" ");
      const lines = [];
      let current = "";
      words.forEach(function (w) {
        if (w.length > maxChars) {
          if (current) {
            lines.push(current);
            current = "";
          }
          for (let i = 0; i < w.length; i += maxChars) {
            lines.push(w.slice(i, i + maxChars));
          }
        } else if (!current) {
          current = w;
        } else if ((current + " " + w).length <= maxChars) {
          current += " " + w;
        } else {
          lines.push(current);
          current = w;
        }
      });
      if (current) lines.push(current);
      return lines;
    };

    const numberKind = clean(values.numberKind) || "ISO number";
    const bearingNumber = upper(values.bearingNumber);
    const rawSuffixes = [
      resolveChoice(values.suffix1, values.suffix1Other),
      resolveChoice(values.suffix2, values.suffix2Other),
      resolveChoice(values.suffix3, values.suffix3Other)
    ];
    const brand = resolveChoice(values.brand, values.brandOther);

    const suffixes = [];
    const seen = {};
    rawSuffixes.forEach(function (s) {
      if (s && !seen[s]) {
        seen[s] = true;
        suffixes.push(s);
      }
    });

    const has2Z = Boolean(seen["2Z"]);
    const has2RS = Boolean(seen["2RS"]);
    const pal = mod.drawingColors;

    const drawingChoiceMap = {
      "Ball": "ball",
      "Cylindrical roller": "cylindrical",
      "Tapered roller": "tapered",
      "Spherical roller": "spherical",
      "Thrust ball": "thrust",
      "Needle roller": "needle",
      "Neutral": "none"
    };
    const drawingChoice = clean(values.drawingType) || "Auto";
    const detected = mod.detectBearingType(numberKind, bearingNumber);
    const isChosen = drawingChoice !== "Auto" && Boolean(drawingChoiceMap[drawingChoice]);
    const family = isChosen ? drawingChoiceMap[drawingChoice] : detected.family;
    const typeLineText = isChosen
      ? ("Type: " + drawingChoice + " (chosen)")
      : (detected.family === "none"
          ? "Type: not recognized"
          : ("Type: " + detected.label + " (from number)"));

    const topText = clean(shortNameText);
    const topLines = topText ? wrapLines(topText, 36) : ["NEW BEARING"];
    const topIsPlaceholder = !topText;
    const topShift = Math.max(0, topLines.length - 1) * 15;

    const topSvg = topLines.map(function (line, i) {
      const y = 22 + i * 15;
      const color = topIsPlaceholder ? "#94A3B8" : "#10302A";
      return (
        '<text x="190" y="' + y + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + color + '">' +
          esc(line) +
        '</text>'
      );
    }).join("");

    const defsSvg =
      '<defs>' +
        '<linearGradient id="brg-steel-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#F8FAFC" />' +
          '<stop offset="45%" stop-color="#E2E8F0" />' +
          '<stop offset="100%" stop-color="#CBD5E1" />' +
        '</linearGradient>' +
        '<radialGradient id="brg-ball-grad" cx="35%" cy="35%" r="65%">' +
          '<stop offset="0%" stop-color="#FFFFFF" />' +
          '<stop offset="60%" stop-color="#CBD5E1" />' +
          '<stop offset="100%" stop-color="#64748B" />' +
        '</radialGradient>' +
      '</defs>';

    const yOffset = topShift;
    const cx = 136;
    const cy = 132 + yOffset;
    const rOut = 66;
    const rOuterRace = 51;
    const rBallCenter = 39;
    const rBall = 10;
    const rInnerRace = 27;
    const rBore = 16;

    const sx = 282;
    const swHalf = 22;
    const sLeft = sx - swHalf;
    const sRight = sx + swHalf;

    let frontViewSvg = '<text x="' + cx + '" y="' + (cy - rOut - 10) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#476B62">Front view</text>';
    let sideViewSvg = '<text x="' + sx + '" y="' + (cy - rOut - 10) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#476B62">Side section</text>';

    if (family === "ball") {
      let ballsSvg = "";
      for (let k = 0; k < 8; k++) {
        const ang = (k * 45) * Math.PI / 180;
        const bx = (cx + rBallCenter * Math.cos(ang)).toFixed(2);
        const by = (cy + rBallCenter * Math.sin(ang)).toFixed(2);
        ballsSvg +=
          '<circle cx="' + bx + '" cy="' + by + '" r="' + rBall + '" fill="url(#brg-ball-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" />';
      }

      let frontClosureSvg = "";
      if (has2RS) {
        frontClosureSvg =
          '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOuterRace + '" fill="' + pal.rubberFill + '" stroke="' + pal.rubberStroke + '" stroke-width="1.1" />' +
          '<circle cx="' + cx + '" cy="' + cy + '" r="' + (rBallCenter + 2) + '" fill="none" stroke="#4B5563" stroke-width="0.9" stroke-dasharray="4 3" />';
      } else if (has2Z) {
        frontClosureSvg =
          '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOuterRace + '" fill="' + pal.steelShade + '" stroke="' + pal.steelStroke + '" stroke-width="1.1" />' +
          '<circle cx="' + cx + '" cy="' + cy + '" r="' + (rBallCenter + 2) + '" fill="none" stroke="' + pal.steelDark + '" stroke-width="0.9" />';
      }

      frontViewSvg +=
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOut + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.2" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOuterRace + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1" />' +
        ballsSvg +
        frontClosureSvg +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rInnerRace + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rBore + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1.2" />';

      let sideClosureSvg = "";
      if (has2RS) {
        sideClosureSvg =
          '<rect x="' + (sLeft + 4) + '" y="' + (cy - rOuterRace) + '" width="4" height="' + (rOuterRace - rInnerRace) + '" fill="' + pal.rubberFill + '" stroke="' + pal.rubberStroke + '" stroke-width="0.9" stroke-linejoin="miter" />' +
          '<rect x="' + (sRight - 8) + '" y="' + (cy - rOuterRace) + '" width="4" height="' + (rOuterRace - rInnerRace) + '" fill="' + pal.rubberFill + '" stroke="' + pal.rubberStroke + '" stroke-width="0.9" stroke-linejoin="miter" />' +
          '<rect x="' + (sLeft + 4) + '" y="' + (cy + rInnerRace) + '" width="4" height="' + (rOuterRace - rInnerRace) + '" fill="' + pal.rubberFill + '" stroke="' + pal.rubberStroke + '" stroke-width="0.9" stroke-linejoin="miter" />' +
          '<rect x="' + (sRight - 8) + '" y="' + (cy + rInnerRace) + '" width="4" height="' + (rOuterRace - rInnerRace) + '" fill="' + pal.rubberFill + '" stroke="' + pal.rubberStroke + '" stroke-width="0.9" stroke-linejoin="miter" />';
      } else if (has2Z) {
        sideClosureSvg =
          '<rect x="' + (sLeft + 4) + '" y="' + (cy - rOuterRace) + '" width="3.5" height="' + (rOuterRace - rInnerRace) + '" fill="' + pal.steelShade + '" stroke="' + pal.steelStroke + '" stroke-width="0.9" stroke-linejoin="miter" />' +
          '<rect x="' + (sRight - 7.5) + '" y="' + (cy - rOuterRace) + '" width="3.5" height="' + (rOuterRace - rInnerRace) + '" fill="' + pal.steelShade + '" stroke="' + pal.steelStroke + '" stroke-width="0.9" stroke-linejoin="miter" />' +
          '<rect x="' + (sLeft + 4) + '" y="' + (cy + rInnerRace) + '" width="3.5" height="' + (rOuterRace - rInnerRace) + '" fill="' + pal.steelShade + '" stroke="' + pal.steelStroke + '" stroke-width="0.9" stroke-linejoin="miter" />' +
          '<rect x="' + (sRight - 7.5) + '" y="' + (cy + rInnerRace) + '" width="3.5" height="' + (rOuterRace - rInnerRace) + '" fill="' + pal.steelShade + '" stroke="' + pal.steelStroke + '" stroke-width="0.9" stroke-linejoin="miter" />';
      }

      sideViewSvg +=
        '<rect x="' + sLeft + '" y="' + (cy - rOut) + '" width="' + (swHalf * 2) + '" height="' + (rOut * 2) + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy - rOut) + '" width="' + (swHalf * 2) + '" height="' + (rOut - rOuterRace) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy + rOuterRace) + '" width="' + (swHalf * 2) + '" height="' + (rOut - rOuterRace) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy - rInnerRace) + '" width="' + (swHalf * 2) + '" height="' + (rInnerRace - rBore) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy + rBore) + '" width="' + (swHalf * 2) + '" height="' + (rInnerRace - rBore) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<line x1="' + (sLeft - 6) + '" y1="' + cy + '" x2="' + (sRight + 6) + '" y2="' + cy + '" stroke="' + pal.steelDark + '" stroke-width="0.9" stroke-dasharray="4 3" />' +
        '<circle cx="' + sx + '" cy="' + (cy - rBallCenter) + '" r="' + rBall + '" fill="url(#brg-ball-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" />' +
        '<circle cx="' + sx + '" cy="' + (cy + rBallCenter) + '" r="' + rBall + '" fill="url(#brg-ball-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" />' +
        sideClosureSvg;
    } else if (family === "cylindrical") {
      let cylFrontRollers = "";
      for (let k = 0; k < 10; k++) {
        const deg = k * 36;
        cylFrontRollers +=
          '<rect x="' + (cx - 7) + '" y="' + (cy - rBallCenter - 7) + '" width="14" height="14" rx="2.5" ' +
            'transform="rotate(' + deg + ' ' + cx + ' ' + cy + ')" ' +
            'fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" stroke-linejoin="miter" />';
      }
      frontViewSvg +=
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOut + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.2" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOuterRace + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1" />' +
        cylFrontRollers +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rInnerRace + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rBore + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1.2" />';

      const cylLen = 24;
      const cylX = sx - 12;
      const cylH = rOuterRace - rInnerRace;
      sideViewSvg +=
        '<rect x="' + sLeft + '" y="' + (cy - rOut) + '" width="' + (swHalf * 2) + '" height="' + (rOut * 2) + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy - rOut) + '" width="' + (swHalf * 2) + '" height="' + (rOut - rOuterRace) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy + rOuterRace) + '" width="' + (swHalf * 2) + '" height="' + (rOut - rOuterRace) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy - rInnerRace) + '" width="' + (swHalf * 2) + '" height="' + (rInnerRace - rBore) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy + rBore) + '" width="' + (swHalf * 2) + '" height="' + (rInnerRace - rBore) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<line x1="' + (sLeft - 6) + '" y1="' + cy + '" x2="' + (sRight + 6) + '" y2="' + cy + '" stroke="' + pal.steelDark + '" stroke-width="0.9" stroke-dasharray="4 3" />' +
        '<rect x="' + cylX + '" y="' + (cy - rOuterRace) + '" width="' + cylLen + '" height="' + cylH + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + cylX + '" y="' + (cy + rInnerRace) + '" width="' + cylLen + '" height="' + cylH + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<line x1="' + cylX + '" y1="' + (cy - rBallCenter) + '" x2="' + (cylX + cylLen) + '" y2="' + (cy - rBallCenter) + '" stroke="' + pal.steelDark + '" stroke-width="0.8" />' +
        '<line x1="' + cylX + '" y1="' + (cy + rBallCenter) + '" x2="' + (cylX + cylLen) + '" y2="' + (cy + rBallCenter) + '" stroke="' + pal.steelDark + '" stroke-width="0.8" />';
    } else if (family === "tapered") {
      let tapFrontRollers = "";
      for (let k = 0; k < 10; k++) {
        const deg = k * 36;
        const pts = [
          (cx - 8) + "," + (cy - rOuterRace + 3),
          (cx + 8) + "," + (cy - rOuterRace + 3),
          (cx + 5) + "," + (cy - rInnerRace - 3),
          (cx - 5) + "," + (cy - rInnerRace - 3)
        ].join(" ");
        tapFrontRollers +=
          '<polygon points="' + pts + '" transform="rotate(' + deg + ' ' + cx + ' ' + cy + ')" ' +
            'fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" stroke-linejoin="miter" />';
      }
      frontViewSvg +=
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOut + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.2" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOuterRace + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1" />' +
        tapFrontRollers +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rInnerRace + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rBore + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1.2" />';

      const cupTopPts = sLeft + "," + (cy - rOut) + " " + sRight + "," + (cy - rOut) + " " + sRight + "," + (cy - rOuterRace + 4) + " " + sLeft + "," + (cy - rOuterRace - 5);
      const cupBotPts = sLeft + "," + (cy + rOut) + " " + sRight + "," + (cy + rOut) + " " + sRight + "," + (cy + rOuterRace - 4) + " " + sLeft + "," + (cy + rOuterRace + 5);

      const coneTopPts = sLeft + "," + (cy - rBore) + " " + sRight + "," + (cy - rBore) + " " + sRight + "," + (cy - rInnerRace - 3) + " " + sLeft + "," + (cy - rInnerRace - 7);
      const coneBotPts = sLeft + "," + (cy + rBore) + " " + sRight + "," + (cy + rBore) + " " + sRight + "," + (cy + rInnerRace + 3) + " " + sLeft + "," + (cy + rInnerRace + 7);

      const rollerTopPts = (sLeft + 6) + "," + (cy - rOuterRace - 4) + " " + (sRight - 6) + "," + (cy - rOuterRace + 3) + " " + (sRight - 6) + "," + (cy - rInnerRace - 3) + " " + (sLeft + 6) + "," + (cy - rInnerRace - 6);
      const rollerBotPts = (sLeft + 6) + "," + (cy + rOuterRace + 4) + " " + (sRight - 6) + "," + (cy + rOuterRace - 3) + " " + (sRight - 6) + "," + (cy + rInnerRace + 3) + " " + (sLeft + 6) + "," + (cy + rInnerRace + 6);

      sideViewSvg +=
        '<rect x="' + sLeft + '" y="' + (cy - rOut) + '" width="' + (swHalf * 2) + '" height="' + (rOut * 2) + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1" stroke-linejoin="miter" />' +
        '<polygon points="' + cupTopPts + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<polygon points="' + cupBotPts + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<polygon points="' + coneTopPts + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<polygon points="' + coneBotPts + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<line x1="' + (sLeft - 6) + '" y1="' + cy + '" x2="' + (sRight + 6) + '" y2="' + cy + '" stroke="' + pal.steelDark + '" stroke-width="0.9" stroke-dasharray="4 3" />' +
        '<polygon points="' + rollerTopPts + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<polygon points="' + rollerBotPts + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />';
    } else if (family === "spherical") {
      let sphFrontRollers = "";
      for (let k = 0; k < 10; k++) {
        const deg = k * 36;
        sphFrontRollers +=
          '<ellipse cx="' + cx + '" cy="' + (cy - rBallCenter) + '" rx="6.5" ry="10.5" ' +
            'transform="rotate(' + deg + ' ' + cx + ' ' + cy + ')" ' +
            'fill="url(#brg-ball-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" />';
      }
      frontViewSvg +=
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOut + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.2" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOuterRace + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1" />' +
        sphFrontRollers +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rInnerRace + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rBore + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1.2" />';

      const sphOuterTop =
        'M ' + sLeft + ' ' + (cy - rOut) +
        ' L ' + sRight + ' ' + (cy - rOut) +
        ' L ' + sRight + ' ' + (cy - rOuterRace + 3) +
        ' Q ' + sx + ' ' + (cy - rOuterRace - 8) + ' ' + sLeft + ' ' + (cy - rOuterRace + 3) + ' Z';
      const sphOuterBot =
        'M ' + sLeft + ' ' + (cy + rOut) +
        ' L ' + sRight + ' ' + (cy + rOut) +
        ' L ' + sRight + ' ' + (cy + rOuterRace - 3) +
        ' Q ' + sx + ' ' + (cy + rOuterRace + 8) + ' ' + sLeft + ' ' + (cy + rOuterRace - 3) + ' Z';

      const sphInnerTop =
        'M ' + sLeft + ' ' + (cy - rBore) +
        ' L ' + sRight + ' ' + (cy - rBore) +
        ' L ' + sRight + ' ' + (cy - rInnerRace + 1) +
        ' L ' + (sx + 3) + ' ' + (cy - rInnerRace - 4) +
        ' L ' + (sx - 3) + ' ' + (cy - rInnerRace - 4) +
        ' L ' + sLeft + ' ' + (cy - rInnerRace + 1) + ' Z';
      const sphInnerBot =
        'M ' + sLeft + ' ' + (cy + rBore) +
        ' L ' + sRight + ' ' + (cy + rBore) +
        ' L ' + sRight + ' ' + (cy + rInnerRace - 1) +
        ' L ' + (sx + 3) + ' ' + (cy + rInnerRace + 4) +
        ' L ' + (sx - 3) + ' ' + (cy + rInnerRace + 4) +
        ' L ' + sLeft + ' ' + (cy + rInnerRace - 1) + ' Z';

      const lx = sx - 10;
      const rx = sx + 10;
      const ty = cy - rBallCenter;
      const by = cy + rBallCenter;
      sideViewSvg +=
        '<rect x="' + sLeft + '" y="' + (cy - rOut) + '" width="' + (swHalf * 2) + '" height="' + (rOut * 2) + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1" stroke-linejoin="miter" />' +
        '<path d="' + sphOuterTop + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<path d="' + sphOuterBot + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<path d="' + sphInnerTop + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<path d="' + sphInnerBot + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<line x1="' + (sLeft - 6) + '" y1="' + cy + '" x2="' + (sRight + 6) + '" y2="' + cy + '" stroke="' + pal.steelDark + '" stroke-width="0.9" stroke-dasharray="4 3" />' +
        '<ellipse cx="' + lx + '" cy="' + ty + '" rx="7" ry="10.5" transform="rotate(-14 ' + lx + ' ' + ty + ')" fill="url(#brg-ball-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" />' +
        '<ellipse cx="' + rx + '" cy="' + ty + '" rx="7" ry="10.5" transform="rotate(14 ' + rx + ' ' + ty + ')" fill="url(#brg-ball-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" />' +
        '<ellipse cx="' + lx + '" cy="' + by + '" rx="7" ry="10.5" transform="rotate(14 ' + lx + ' ' + by + ')" fill="url(#brg-ball-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" />' +
        '<ellipse cx="' + rx + '" cy="' + by + '" rx="7" ry="10.5" transform="rotate(-14 ' + rx + ' ' + by + ')" fill="url(#brg-ball-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" />';
    } else if (family === "thrust") {
      let thrBalls = "";
      for (let k = 0; k < 10; k++) {
        const ang = (k * 36) * Math.PI / 180;
        const bx = (cx + rBallCenter * Math.cos(ang)).toFixed(2);
        const by = (cy + rBallCenter * Math.sin(ang)).toFixed(2);
        thrBalls +=
          '<circle cx="' + bx + '" cy="' + by + '" r="8.5" fill="url(#brg-ball-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" />';
      }
      frontViewSvg +=
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOut + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.2" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + (rOut - 9) + '" fill="none" stroke="' + pal.steelDark + '" stroke-width="0.9" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOuterRace + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rBallCenter + '" fill="none" stroke="' + pal.steelDark + '" stroke-width="0.9" stroke-dasharray="3 3" />' +
        thrBalls +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rInnerRace + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rBore + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1.2" />';

      const washerW = 12;
      const rWasherIn = rBore + 2;
      const washerH = rOut - rWasherIn;
      sideViewSvg +=
        '<rect x="' + sLeft + '" y="' + (cy - rOut) + '" width="' + (swHalf * 2) + '" height="' + (rOut * 2) + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy - rOut) + '" width="' + washerW + '" height="' + washerH + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy + rWasherIn) + '" width="' + washerW + '" height="' + washerH + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + (sRight - washerW) + '" y="' + (cy - rOut) + '" width="' + washerW + '" height="' + washerH + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + (sRight - washerW) + '" y="' + (cy + rWasherIn) + '" width="' + washerW + '" height="' + washerH + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<line x1="' + (sLeft - 6) + '" y1="' + cy + '" x2="' + (sRight + 6) + '" y2="' + cy + '" stroke="' + pal.steelDark + '" stroke-width="0.9" stroke-dasharray="4 3" />' +
        '<circle cx="' + sx + '" cy="' + (cy - rBallCenter) + '" r="9.5" fill="url(#brg-ball-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" />' +
        '<circle cx="' + sx + '" cy="' + (cy + rBallCenter) + '" r="9.5" fill="url(#brg-ball-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" />';
    } else if (family === "needle") {
      const nOut = 64;
      const nOuterRace = 55;
      const nNeedleCenter = 48.5;
      const nNeedleR = 3.2;
      const nInnerRace = 42;
      const nBore = 33;

      let needlesSvg = "";
      for (let k = 0; k < 24; k++) {
        const ang = (k * 15) * Math.PI / 180;
        const nx = (cx + nNeedleCenter * Math.cos(ang)).toFixed(2);
        const ny = (cy + nNeedleCenter * Math.sin(ang)).toFixed(2);
        needlesSvg +=
          '<circle cx="' + nx + '" cy="' + ny + '" r="' + nNeedleR + '" fill="url(#brg-ball-grad)" stroke="' + pal.steelStroke + '" stroke-width="0.8" />';
      }
      frontViewSvg +=
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + nOut + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.2" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + nOuterRace + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1" />' +
        needlesSvg +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + nInnerRace + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + nBore + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1.2" />';

      const nSideLen = 34;
      const nSideX = sx - 17;
      const nRollerH = 6.5;
      sideViewSvg +=
        '<rect x="' + sLeft + '" y="' + (cy - nOut) + '" width="' + (swHalf * 2) + '" height="' + (nOut * 2) + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy - nOut) + '" width="' + (swHalf * 2) + '" height="' + (nOut - nOuterRace) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy + nOuterRace) + '" width="' + (swHalf * 2) + '" height="' + (nOut - nOuterRace) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy - nInnerRace) + '" width="' + (swHalf * 2) + '" height="' + (nInnerRace - nBore) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy + nBore) + '" width="' + (swHalf * 2) + '" height="' + (nInnerRace - nBore) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<line x1="' + (sLeft - 6) + '" y1="' + cy + '" x2="' + (sRight + 6) + '" y2="' + cy + '" stroke="' + pal.steelDark + '" stroke-width="0.9" stroke-dasharray="4 3" />' +
        '<rect x="' + nSideX + '" y="' + (cy - nOuterRace + 3) + '" width="' + nSideLen + '" height="' + nRollerH + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" stroke-linejoin="miter" />' +
        '<rect x="' + nSideX + '" y="' + (cy + nInnerRace + 3) + '" width="' + nSideLen + '" height="' + nRollerH + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1" stroke-linejoin="miter" />';
    } else {
      /* Neutral (none): outer ring and inner ring only, no rolling elements */
      frontViewSvg +=
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOut + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.2" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rOuterRace + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rInnerRace + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" />' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + rBore + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1.2" />';

      sideViewSvg +=
        '<rect x="' + sLeft + '" y="' + (cy - rOut) + '" width="' + (swHalf * 2) + '" height="' + (rOut * 2) + '" fill="#FFFFFF" stroke="' + pal.steelStroke + '" stroke-width="1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy - rOut) + '" width="' + (swHalf * 2) + '" height="' + (rOut - rOuterRace) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy + rOuterRace) + '" width="' + (swHalf * 2) + '" height="' + (rOut - rOuterRace) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy - rInnerRace) + '" width="' + (swHalf * 2) + '" height="' + (rInnerRace - rBore) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<rect x="' + sLeft + '" y="' + (cy + rBore) + '" width="' + (swHalf * 2) + '" height="' + (rInnerRace - rBore) + '" fill="url(#brg-steel-grad)" stroke="' + pal.steelStroke + '" stroke-width="1.1" stroke-linejoin="miter" />' +
        '<line x1="' + (sLeft - 6) + '" y1="' + cy + '" x2="' + (sRight + 6) + '" y2="' + cy + '" stroke="' + pal.steelDark + '" stroke-width="0.9" stroke-dasharray="4 3" />';
    }

    /* Separate info lines below drawing (never starting with |, omit empty values) */
    const reqColor = "#10302A";
    const optColor = "#0F3B33";
    const missingColor = "#64748B";
    const infoStartY = cy + rOut + 24;

    const infoEntries = [];
    infoEntries.push({
      text: typeLineText,
      color: (detected.family === "none" && !isChosen) ? missingColor : reqColor
    });

    if (bearingNumber) {
      infoEntries.push({
        text: numberKind === "Part number" ? ("Part No: " + bearingNumber) : ("Number: " + bearingNumber),
        color: reqColor
      });
    }
    if (suffixes.length > 0) {
      infoEntries.push({
        text: "Suffixes: " + suffixes.join(" "),
        color: optColor
      });
    }
    if (has2RS || has2Z) {
      const closureParts = [];
      if (has2RS) closureParts.push("Rubber seals (2RS)");
      if (has2Z) closureParts.push("Metal shields (2Z)");
      infoEntries.push({
        text: "Closure: " + closureParts.join(", "),
        color: optColor
      });
    }
    if (brand) {
      infoEntries.push({
        text: "Brand: " + brand,
        color: optColor
      });
    }

    const renderedInfoLines = [];
    infoEntries.forEach(function (entry) {
      wrapLines(entry.text, 56).forEach(function (line) {
        renderedInfoLines.push({ text: line, color: entry.color });
      });
    });

    const infoSvg = renderedInfoLines.map(function (item, idx) {
      const y = infoStartY + idx * 17;
      return (
        '<text x="190" y="' + y + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + item.color + '">' +
          esc(item.text) +
        '</text>'
      );
    }).join("");

    const totalHeight = infoStartY + Math.max(1, renderedInfoLines.length) * 17 + 10;

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" data-bearing-family="' + esc(family) + '" shape-rendering="geometricPrecision" role="img" aria-label="Bearing technical drawing">' +
        defsSvg +
        '<rect x="0" y="0" width="380" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        '<g class="bolt-shape-animate">' +
          frontViewSvg +
          sideViewSvg +
        '</g>' +
        infoSvg +
      '</svg>'
    );
  },

  /* Draw the Bearing screen */
  renderScreen: function (container, goBack) {
    const mod = this;

    function makeOptionsHtml(items, placeholderText, includeOther) {
      const opts = placeholderText ? ['<option value="">' + placeholderText + '</option>'] : [];
      items.forEach(function (item) {
        opts.push('<option value="' + item + '">' + item + '</option>');
      });
      if (includeOther) {
        opts.push('<option value="__OTHER__">Other (type it)</option>');
      }
      return opts.join("");
    }

    container.innerHTML =
      '<div class="item-header card-stagger" style="--card-index: 0;">' +
        '<button type="button" class="back-btn" id="brg-back-btn" aria-label="Back to Rules">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M15 18l-6-6 6-6"></path>' +
          '</svg>' +
        '</button>' +
        '<h1 class="item-screen-title">' + mod.name + '</h1>' +
      '</div>' +

      '<section class="card name-card card-stagger" style="--card-index: 1;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">SAP Short Text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="brg-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="brg-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="brg-name-box" class="name-textarea" rows="2" aria-label="SAP Short Text" autocapitalize="characters" spellcheck="false" placeholder="PICK FIELDS BELOW TO BUILD NAME..."></textarea>' +

        '<div class="name-meta-row">' +
          '<span id="brg-char-counter" class="char-counter">0 / 40</span>' +
          '<p id="brg-missing-note" class="missing-note"></p>' +
        '</div>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 2;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Long text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="brg-long-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="brg-long-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="brg-long-box" class="name-textarea long-textarea" rows="3" aria-label="Long text" placeholder="Pick fields below to build long text..."></textarea>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 3;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Drawing</h2>' +
        '</div>' +
        '<div id="brg-drawing-frame" class="drawing-frame"></div>' +
      '</section>' +

      '<section class="card add-export-card card-stagger" style="--card-index: 4;">' +
        '<button type="button" class="btn-primary add-export-btn" id="brg-add-export-btn">Add to export list</button>' +
        '<p id="brg-export-feedback" class="add-export-feedback is-hidden" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card card-stagger" style="--card-index: 5;">' +
        '<div class="fields-grid">' +
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="brg-number-kind">Number kind</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="brg-number-kind" class="field-control">' +
              '<option value="ISO number" selected>ISO number</option>' +
              '<option value="Part number">Part number</option>' +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="brg-number">Bearing number</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<input id="brg-number" type="text" class="field-control" placeholder="e.g. 6307 or NU 2312" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="brg-suffix1">Suffix 1</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="brg-suffix1" class="field-control">' +
              makeOptionsHtml(mod.lists.suffix, "Select suffix 1", true) +
            '</select>' +
            '<input id="brg-suffix1-other" type="text" class="field-control" style="display: none;" placeholder="Type suffix, e.g. NR" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="brg-suffix2">Suffix 2</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="brg-suffix2" class="field-control">' +
              makeOptionsHtml(mod.lists.suffix, "Select suffix 2", true) +
            '</select>' +
            '<input id="brg-suffix2-other" type="text" class="field-control" style="display: none;" placeholder="Type suffix, e.g. W33" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="brg-suffix3">Suffix 3</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="brg-suffix3" class="field-control">' +
              makeOptionsHtml(mod.lists.suffix, "Select suffix 3", true) +
            '</select>' +
            '<input id="brg-suffix3-other" type="text" class="field-control" style="display: none;" placeholder="Type suffix" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="brg-brand">Brand</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="brg-brand" class="field-control">' +
              makeOptionsHtml(mod.lists.brand, "Select brand", true) +
            '</select>' +
            '<input id="brg-brand-other" type="text" class="field-control" style="display: none;" placeholder="Type brand, e.g. KOYO" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="brg-drawing-type">Drawing type</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="brg-drawing-type" class="field-control">' +
              '<option value="Auto" selected>Auto</option>' +
              makeOptionsHtml(mod.lists.drawingType.slice(1), "", false) +
            '</select>' +
          '</div>' +
        '</div>' +
      '</section>';

    const backBtn = document.getElementById("brg-back-btn");
    const nameBox = document.getElementById("brg-name-box");
    const charCounter = document.getElementById("brg-char-counter");
    const missingNote = document.getElementById("brg-missing-note");
    const rebuildBtn = document.getElementById("brg-rebuild-btn");
    const copyBtn = document.getElementById("brg-copy-btn");
    const longBox = document.getElementById("brg-long-box");
    const longRebuildBtn = document.getElementById("brg-long-rebuild-btn");
    const longCopyBtn = document.getElementById("brg-long-copy-btn");
    const drawingFrame = document.getElementById("brg-drawing-frame");
    const addExportBtn = document.getElementById("brg-add-export-btn");
    const exportFeedback = document.getElementById("brg-export-feedback");

    const inputs = {
      numberKind: document.getElementById("brg-number-kind"),
      bearingNumber: document.getElementById("brg-number"),
      suffix1: document.getElementById("brg-suffix1"),
      suffix1Other: document.getElementById("brg-suffix1-other"),
      suffix2: document.getElementById("brg-suffix2"),
      suffix2Other: document.getElementById("brg-suffix2-other"),
      suffix3: document.getElementById("brg-suffix3"),
      suffix3Other: document.getElementById("brg-suffix3-other"),
      brand: document.getElementById("brg-brand"),
      brandOther: document.getElementById("brg-brand-other"),
      drawingType: document.getElementById("brg-drawing-type")
    };

    function syncConditionalControls() {
      inputs.suffix1Other.style.display = inputs.suffix1.value === "__OTHER__" ? "" : "none";
      inputs.suffix2Other.style.display = inputs.suffix2.value === "__OTHER__" ? "" : "none";
      inputs.suffix3Other.style.display = inputs.suffix3.value === "__OTHER__" ? "" : "none";
      inputs.brandOther.style.display = inputs.brand.value === "__OTHER__" ? "" : "none";
    }

    function readFieldValues() {
      const out = {};
      Object.keys(inputs).forEach(function (k) {
        out[k] = inputs[k].value;
      });
      return out;
    }

    function clearExportFeedback() {
      exportFeedback.textContent = "";
      exportFeedback.className = "add-export-feedback is-hidden";
    }

    function showExportFeedback(message, isError) {
      exportFeedback.textContent = message;
      exportFeedback.className = "add-export-feedback " + (isError ? "is-error" : "is-success");
    }

    function updateStatusDisplay() {
      const len = nameBox.value.length;
      const isOver = len > 40;
      const isNear = len >= 36 && !isOver;

      nameBox.classList.toggle("is-over", isOver);
      charCounter.classList.toggle("is-near", isNear);
      charCounter.classList.toggle("is-over", isOver);
      charCounter.textContent = isOver ? ("Too long: " + len + " / 40") : (len + " / 40");

      const missing = mod.getMissingRequired(readFieldValues());
      if (missing.length > 0) {
        missingNote.textContent = "Missing: " + missing.join(", ");
        missingNote.classList.remove("is-hidden");
      } else {
        missingNote.textContent = "";
        missingNote.classList.add("is-hidden");
      }
    }

    function updateDrawing() {
      drawingFrame.innerHTML = mod.buildDrawingSvg(readFieldValues(), nameBox.value);
    }

    function rebuildShortFromFields() {
      syncConditionalControls();
      nameBox.value = mod.buildShortText(readFieldValues());
      updateStatusDisplay();
      updateDrawing();
      clearExportFeedback();
    }

    function rebuildLongFromFields() {
      syncConditionalControls();
      longBox.value = mod.buildLongText(readFieldValues());
    }

    function rebuildAllFromFields() {
      rebuildShortFromFields();
      rebuildLongFromFields();
    }

    function copyTextarea(textarea, buttonEl) {
      const textToCopy = textarea.value;
      const showCopied = function () {
        buttonEl.textContent = "Copied";
        setTimeout(function () {
          buttonEl.textContent = "Copy";
        }, 1400);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(showCopied).catch(function () {
          textarea.select();
          document.execCommand("copy");
          showCopied();
        });
      } else {
        textarea.select();
        document.execCommand("copy");
        showCopied();
      }
    }

    Object.keys(inputs).forEach(function (key) {
      const el = inputs[key];
      if (key === "drawingType") {
        el.addEventListener("input", updateDrawing);
        el.addEventListener("change", updateDrawing);
      } else {
        el.addEventListener("input", rebuildAllFromFields);
        el.addEventListener("change", rebuildAllFromFields);
      }
    });

    nameBox.addEventListener("input", function () {
      const start = nameBox.selectionStart;
      const end = nameBox.selectionEnd;
      const upper = nameBox.value.toUpperCase();
      if (nameBox.value !== upper) {
        nameBox.value = upper;
        if (typeof start === "number" && typeof end === "number") {
          nameBox.setSelectionRange(start, end);
        }
      }
      updateStatusDisplay();
      updateDrawing();
      clearExportFeedback();
    });

    rebuildBtn.addEventListener("click", rebuildShortFromFields);

    copyBtn.addEventListener("click", function () {
      copyTextarea(nameBox, copyBtn);
    });

    longRebuildBtn.addEventListener("click", rebuildLongFromFields);

    longCopyBtn.addEventListener("click", function () {
      copyTextarea(longBox, longCopyBtn);
    });

    addExportBtn.addEventListener("click", function () {
      const values = readFieldValues();
      const shortName = String(nameBox.value || "").trim();
      const longText = String(longBox.value || "").trim();
      const missing = mod.getMissingRequired(values);
      const reasons = [];

      if (missing.length > 0) {
        reasons.push("Missing required: " + missing.join(", "));
      }
      if (!shortName) {
        reasons.push("Short name is empty");
      } else if (shortName.length > 40) {
        reasons.push("Short name is over 40 characters (" + shortName.length + " / 40)");
      }

      if (reasons.length > 0) {
        showExportFeedback("Cannot add: " + reasons.join(". ") + ".", true);
        return;
      }

      const newCount = QSExport.add({
        moduleId: mod.id,
        moduleName: mod.name,
        shortName: shortName,
        longText: longText,
        fields: values,
        sapDefaults: {
          materialType: mod.exportDefaults.materialType,
          baseUnit: mod.exportDefaults.baseUnit,
          materialGroup: mod.exportDefaults.materialGroup
        }
      });

      showExportFeedback(
        "Added. " + newCount + (newCount === 1 ? " item" : " items") + " in the list",
        false
      );
    });

    backBtn.addEventListener("click", goBack);

    rebuildAllFromFields();
  }
});
