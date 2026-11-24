/* ----- HOSE MODULE ----- */
window.QS_MODULES.push({
  id: "hose",
  name: "Hose",
  searchWords: ["hose", "hoses", "pipe", "hydraulic"],
  tileBg: "#E4F9F0",
  tileColor: "#144D3E",
  iconSvg:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 15v-3a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v3"></path>' +
      '<rect x="2" y="15" width="4" height="5" rx="1"></rect>' +
      '<rect x="18" y="15" width="4" height="5" rx="1"></rect>' +
      '<path d="M8 7.2v2.6"></path>' +
      '<path d="M16 7.2v2.6"></path>' +
    '</svg>',

  /* SAP export defaults for Hose */
  exportDefaults: {
    materialType: "ERSA",
    baseUnit: "EA",
    materialGroup: "Mechanical"
  },

  /* Easy-to-edit Hose dropdown lists */
  lists: {
    construction: [
      { code: "WW", label: "WW (wire wound)" },
      { code: "SB", label: "SB (steel braided)" },
      { code: "SS", label: "SS (stainless)" }
    ],
    kind: [
      { code: "HHP", label: "HHP (hydraulic)" },
      { code: "WHP", label: "WHP (water)" }
    ],
    size: ['1/4"', '3/8"', '1/2"', '5/8"', '3/4"', '1"', '1-1/4"', '1-1/2"', '2"'],
    shape: [
      { code: "E", label: "E (elbow)" },
      { code: "S", label: "S (straight)" }
    ],
    gender: [
      { code: "M", label: "M (male)" },
      { code: "F", label: "F (female)" }
    ],
    unit: [
      { code: "b", label: "b (bar)" },
      { code: "p", label: "p (psi)" }
    ]
  },

  /* Easy-to-edit plain-word meanings for Long text */
  meanings: {
    construction: {
      "WW": "wire wound",
      "SB": "steel braided",
      "SS": "stainless steel"
    },
    kind: {
      "HHP": "hydraulic hose",
      "WHP": "water hose"
    },
    size: {
      '1/4"': "1/4 inch",
      '3/8"': "3/8 inch",
      '1/2"': "1/2 inch",
      '5/8"': "5/8 inch",
      '3/4"': "3/4 inch",
      '1"': "1 inch",
      '1-1/4"': "1-1/4 inch",
      '1-1/2"': "1-1/2 inch",
      '2"': "2 inch"
    },
    shape: {
      "E": "elbow",
      "S": "straight"
    },
    gender: {
      "M": "male",
      "F": "female"
    },
    unit: {
      "b": "bar",
      "p": "psi"
    }
  },

  /* Build SAP Short Text (max 40 chars) from current values */
  buildShortText: function (values) {
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const upper = function (v) {
      return clean(v).toUpperCase();
    };
    const lower = function (v) {
      return clean(v).toLowerCase();
    };

    const construction = upper(values.construction);
    const kind = upper(values.kind);
    const length = clean(values.length);
    const end1Size = clean(values.end1Size);
    const end1Shape = upper(values.end1Shape);
    const end1Gender = upper(values.end1Gender);
    const end1Thread = upper(values.end1Thread);
    const end2Size = clean(values.end2Size);
    const end2Shape = upper(values.end2Shape);
    const end2Gender = upper(values.end2Gender);
    const end2Thread = upper(values.end2Thread);
    const pressure = clean(values.pressure);
    const unit = lower(values.unit);

    const hasAny = Boolean(
      construction || kind || length ||
      end1Size || end1Shape || end1Gender || end1Thread ||
      end2Size || end2Shape || end2Gender || end2Thread ||
      pressure || unit
    );
    if (!hasAny) {
      return "";
    }

    const prefix = [construction, kind].filter(Boolean).join("");
    const lengthPart = length ? ("L=" + length + "m") : "";

    const buildEnd = function (sz, sh, gn, th) {
      const core = [sz, sh, gn].filter(Boolean).join("");
      if (core && th) return core + " " + th;
      return core || th || "";
    };

    const end1Part = buildEnd(end1Size, end1Shape, end1Gender, end1Thread);
    const end2Part = buildEnd(end2Size, end2Shape, end2Gender, end2Thread);
    let endsPart = "";
    if (end1Part && end2Part) {
      endsPart = end1Part + "-" + end2Part;
    } else {
      endsPart = end1Part || end2Part;
    }

    let wpPart = "";
    if (pressure || unit) {
      wpPart = "WP" + pressure + unit;
    }

    return [prefix, lengthPart, endsPart, wpPart]
      .filter(Boolean)
      .join(",");
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
    const lower = function (v) {
      return clean(v).toLowerCase();
    };

    const conCode = upper(values.construction);
    const kindCode = upper(values.kind);
    const lengthVal = clean(values.length);
    const pressureVal = clean(values.pressure);
    const unitCode = lower(values.unit);

    const conText = mod.meanings.construction[conCode] || "";
    const kindText = mod.meanings.kind[kindCode] || "";
    const leadPhrase = [conText, kindText].filter(Boolean).join(" ");

    const parts = [];
    if (leadPhrase) {
      parts.push(leadPhrase);
    }

    if (lengthVal) {
      parts.push("length " + lengthVal + " m");
    }

    const buildEndLong = function (label, sz, sh, gn, th) {
      const szText = mod.meanings.size[sz] || clean(sz);
      const shText = mod.meanings.shape[upper(sh)] || "";
      const gnText = mod.meanings.gender[upper(gn)] || "";
      const thText = clean(th);
      const endWords = [szText, shText, gnText, thText].filter(Boolean).join(" ");
      if (endWords) {
        parts.push(label + ": " + endWords);
      }
    };

    buildEndLong("end 1", values.end1Size, values.end1Shape, values.end1Gender, values.end1Thread);
    buildEndLong("end 2", values.end2Size, values.end2Shape, values.end2Gender, values.end2Thread);

    const unitText = mod.meanings.unit[unitCode] || "";
    if (pressureVal && unitText) {
      parts.push("working pressure " + pressureVal + " " + unitText);
    } else if (pressureVal) {
      parts.push("working pressure " + pressureVal);
    } else if (unitText) {
      parts.push("working pressure in " + unitText);
    }

    if (parts.length === 0) {
      return "";
    }

    const joined = parts.join(", ");
    return joined.charAt(0).toUpperCase() + joined.slice(1) + ".";
  },

  /* Find which Required fields are still empty */
  getMissingRequired: function (values) {
    const missing = [];
    if (!String(values.construction || "").trim()) missing.push("Construction");
    if (!String(values.kind || "").trim()) missing.push("Kind");
    if (!String(values.length || "").trim()) missing.push("Length");
    if (!String(values.end1Size || "").trim()) missing.push("End 1 Size");
    if (!String(values.end1Shape || "").trim()) missing.push("End 1 Shape");
    if (!String(values.end1Gender || "").trim()) missing.push("End 1 Gender");
    if (!String(values.end2Size || "").trim()) missing.push("End 2 Size");
    if (!String(values.end2Shape || "").trim()) missing.push("End 2 Shape");
    if (!String(values.end2Gender || "").trim()) missing.push("End 2 Gender");
    if (!String(values.pressure || "").trim()) missing.push("Pressure");
    if (!String(values.unit || "").trim()) missing.push("Pressure unit");
    return missing;
  },

  /* Build realistic shaded live SVG drawing of hose + metal end fittings + labels */
  buildDrawingSvg: function (values, shortNameText) {
    const mod = this;
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const upper = function (v) {
      return clean(v).toUpperCase();
    };
    const lower = function (v) {
      return clean(v).toLowerCase();
    };
    const esc = function (s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
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

    const construction = upper(values.construction);
    const kind = upper(values.kind);
    const lengthVal = clean(values.length);
    const pressureVal = clean(values.pressure);
    const unitCode = lower(values.unit);

    const e1Size = clean(values.end1Size);
    const e1Shape = upper(values.end1Shape);
    const e1Gender = upper(values.end1Gender);
    const e1Thread = clean(values.end1Thread);

    const e2Size = clean(values.end2Size);
    const e2Shape = upper(values.end2Shape);
    const e2Gender = upper(values.end2Gender);
    const e2Thread = clean(values.end2Thread);

    /* Top short-name lines */
    const topText = clean(shortNameText);
    const topLines = topText ? wrapLines(topText, 32) : ["NEW HOSE"];
    const topIsPlaceholder = !topText;
    const yOffset = Math.max(0, topLines.length - 1) * 15;

    const topSvg = topLines.map(function (line, i) {
      const y = 22 + i * 15;
      const color = topIsPlaceholder ? "#94A3B8" : "#10302A";
      return (
        '<text x="180" y="' + y + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + color + '">' +
          esc(line) +
        '</text>'
      );
    }).join("");

    /* Unique gradient & clipPath IDs per drawing */
    mod._svgUid = (mod._svgUid || 0) + 1;
    const uid = "hose-g" + mod._svgUid + "-" + Math.random().toString(36).slice(2, 6);
    const gBody = uid + "-body";
    const gClip = uid + "-clip";
    const gSteel = uid + "-steel";
    const gSteelH = uid + "-steelh";
    const gBrass = uid + "-brass";
    const gBrassH = uid + "-brassh";
    const gBrassDark = uid + "-brassd";
    const gBrassDarkH = uid + "-brassdh";

    /* Hose arch coordinates from x=88 to x=272 */
    const yBase = 152 + yOffset;
    const yPeak = 114 + yOffset;
    const yTop = yBase + 0.75 * (yPeak - yBase);
    const archD =
      "M 88 " + yBase +
      " C 120 " + yBase + ", 150 " + yTop + ", 180 " + yTop +
      " C 210 " + yTop + ", 240 " + yBase + ", 272 " + yBase;

    /* Construction palette (empty = WW dark rubber) */
    let bodyHi = "#4B5563";
    let bodyMid = "#1F2937";
    let bodyDark = "#0B0F14";
    let bodyStroke = "#0B0F14";
    let stripeOpacity = "0.28";

    if (construction === "SB") {
      bodyHi = "#F1F5F9";
      bodyMid = "#B8C2CE";
      bodyDark = "#6B7785";
      bodyStroke = "#475569";
      stripeOpacity = "0.52";
    } else if (construction === "SS") {
      bodyHi = "#FFFFFF";
      bodyMid = "#DCE3EA";
      bodyDark = "#8793A1";
      bodyStroke = "#5F6B79";
      stripeOpacity = "0.62";
    }

    /* Sample points along the two cubic Beziers for clipPath + spiral / braid texture */
    const bezPt = function (t) {
      let x, y, dx, dy;
      if (t <= 0.5) {
        const u = t * 2;
        const mu = 1 - u;
        x = mu * mu * mu * 88 + 3 * mu * mu * u * 120 + 3 * mu * u * u * 150 + u * u * u * 180;
        y = mu * mu * mu * yBase + 3 * mu * mu * u * yBase + 3 * mu * u * u * yTop + u * u * u * yTop;
        dx = 3 * mu * mu * 32 + 6 * mu * u * 30 + 3 * u * u * 30;
        dy = 6 * mu * u * (yTop - yBase);
      } else {
        const u = (t - 0.5) * 2;
        const mu = 1 - u;
        x = mu * mu * mu * 180 + 3 * mu * mu * u * 210 + 3 * mu * u * u * 240 + u * u * u * 272;
        y = mu * mu * mu * yTop + 3 * mu * mu * u * yTop + 3 * mu * u * u * yBase + u * u * u * yBase;
        dx = 3 * mu * mu * 30 + 6 * mu * u * 30 + 3 * u * u * 32;
        dy = 6 * mu * u * (yBase - yTop);
      }
      const len = Math.hypot(dx, dy) || 1;
      return { x: x, y: y, tx: dx / len, ty: dy / len, nx: -dy / len, ny: dx / len };
    };

    const clipTopPts = [];
    const clipBotPts = [];
    const halfBodyR = 10.2;
    for (let i = 0; i <= 24; i++) {
      const pt = bezPt(i / 24);
      clipTopPts.push((pt.x + pt.nx * halfBodyR).toFixed(1) + " " + (pt.y + pt.ny * halfBodyR).toFixed(1));
      clipBotPts.unshift((pt.x - pt.nx * halfBodyR).toFixed(1) + " " + (pt.y - pt.ny * halfBodyR).toFixed(1));
    }
    const bodyClipPathD = "M " + clipTopPts.join(" L ") + " L " + clipBotPts.join(" L ") + " Z";

    let textureSvg = "";
    if (!construction || construction === "WW") {
      const spirals = [];
      for (let i = 1; i <= 15; i++) {
        const t1 = Math.max(0.01, (i - 0.5) / 16);
        const t2 = Math.min(0.99, (i + 0.35) / 16);
        const p1 = bezPt(t1);
        const p2 = bezPt(t2);
        const pm = bezPt((t1 + t2) * 0.5);
        const r = 11.4;
        const ax = p1.x - p1.nx * r;
        const ay = p1.y - p1.ny * r;
        const bx = p2.x + p2.nx * r;
        const by = p2.y + p2.ny * r;
        const cx = pm.x + pm.tx * 2.8;
        const cy = pm.y + pm.ty * 2.8;
        spirals.push(
          '<path d="M ' + ax.toFixed(1) + " " + ay.toFixed(1) + " Q " + cx.toFixed(1) + " " + cy.toFixed(1) + " " + bx.toFixed(1) + " " + by.toFixed(1) +
          '" fill="none" stroke="#0B0F14" stroke-width="2.1" stroke-linecap="round" opacity="0.72" />' +
          '<path d="M ' + (ax + pm.tx * 1.6).toFixed(1) + " " + (ay + pm.ty * 1.6).toFixed(1) + " Q " + (cx + pm.tx * 1.6).toFixed(1) + " " + (cy + pm.ty * 1.6).toFixed(1) + " " + (bx + pm.tx * 1.6).toFixed(1) + " " + (by + pm.ty * 1.6).toFixed(1) +
          '" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.28" />'
        );
      }
      textureSvg = spirals.join("");
    } else if (construction === "SB" || construction === "SS") {
      const braids = [];
      const braidDark = (construction === "SS") ? "#6B7785" : "#475569";
      const braidLight = "#FFFFFF";
      const braidOpacity = (construction === "SS") ? "0.52" : "0.62";
      for (let i = 1; i <= 17; i++) {
        const tA = Math.max(0.01, (i - 0.45) / 18);
        const tB = Math.min(0.99, (i + 0.45) / 18);
        const pA = bezPt(tA);
        const pB = bezPt(tB);
        const r = 12;
        braids.push(
          '<line x1="' + (pA.x - pA.nx * r).toFixed(1) + '" y1="' + (pA.y - pA.ny * r).toFixed(1) +
          '" x2="' + (pB.x + pB.nx * r).toFixed(1) + '" y2="' + (pB.y + pB.ny * r).toFixed(1) +
          '" stroke="' + braidDark + '" stroke-width="1.35" opacity="' + braidOpacity + '" />' +
          '<line x1="' + (pA.x + pA.nx * r).toFixed(1) + '" y1="' + (pA.y + pA.ny * r).toFixed(1) +
          '" x2="' + (pB.x - pB.nx * r).toFixed(1) + '" y2="' + (pB.y - pB.ny * r).toFixed(1) +
          '" stroke="' + braidDark + '" stroke-width="1.35" opacity="' + braidOpacity + '" />' +
          '<line x1="' + (pA.x - pA.nx * r + pA.tx * 1.4).toFixed(1) + '" y1="' + (pA.y - pA.ny * r + pA.ty * 1.4).toFixed(1) +
          '" x2="' + (pB.x + pB.nx * r + pB.tx * 1.4).toFixed(1) + '" y2="' + (pB.y + pB.ny * r + pB.ty * 1.4).toFixed(1) +
          '" stroke="' + braidLight + '" stroke-width="0.7" opacity="0.45" />'
        );
      }
      textureSvg = braids.join("");
    }

    const defsSvg =
      '<defs>' +
        '<clipPath id="' + gClip + '">' +
          '<path d="' + bodyClipPathD + '" />' +
        '</clipPath>' +
        '<linearGradient id="' + gBody + '" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="' + bodyMid + '" />' +
          '<stop offset="20%" stop-color="' + bodyHi + '" />' +
          '<stop offset="55%" stop-color="' + bodyMid + '" />' +
          '<stop offset="100%" stop-color="' + bodyDark + '" />' +
        '</linearGradient>' +
        '<linearGradient id="' + gSteel + '" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="#8E9AA8" />' +
          '<stop offset="22%" stop-color="#F1F5F9" />' +
          '<stop offset="58%" stop-color="#B4BFCB" />' +
          '<stop offset="100%" stop-color="#5F6B79" />' +
        '</linearGradient>' +
        '<linearGradient id="' + gSteelH + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#8E9AA8" />' +
          '<stop offset="28%" stop-color="#F1F5F9" />' +
          '<stop offset="60%" stop-color="#B4BFCB" />' +
          '<stop offset="100%" stop-color="#5F6B79" />' +
        '</linearGradient>' +
        '<linearGradient id="' + gBrass + '" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="#CA8A04" />' +
          '<stop offset="20%" stop-color="#FEF08A" />' +
          '<stop offset="55%" stop-color="#EAB308" />' +
          '<stop offset="100%" stop-color="#92400E" />' +
        '</linearGradient>' +
        '<linearGradient id="' + gBrassH + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#CA8A04" />' +
          '<stop offset="25%" stop-color="#FEF08A" />' +
          '<stop offset="58%" stop-color="#EAB308" />' +
          '<stop offset="100%" stop-color="#92400E" />' +
        '</linearGradient>' +
        '<linearGradient id="' + gBrassDark + '" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="#A16207" />' +
          '<stop offset="25%" stop-color="#FDE047" />' +
          '<stop offset="60%" stop-color="#CA8A04" />' +
          '<stop offset="100%" stop-color="#713F12" />' +
        '</linearGradient>' +
        '<linearGradient id="' + gBrassDarkH + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#A16207" />' +
          '<stop offset="25%" stop-color="#FDE047" />' +
          '<stop offset="60%" stop-color="#CA8A04" />' +
          '<stop offset="100%" stop-color="#713F12" />' +
        '</linearGradient>' +
      '</defs>';

    /* Realistic metal fitting renderer for End 1 (side=-1) and End 2 (side=1) */
    const drawFitting = function (side, shape, gender) {
      const hasFit = Boolean(shape || gender);
      const ferruleFill = "url(#" + gSteel + ")";
      const fittingFillV = hasFit ? ("url(#" + gBrass + ")") : ("url(#" + gSteel + ")");
      const fittingFillH = hasFit ? ("url(#" + gBrassH + ")") : ("url(#" + gSteelH + ")");
      const threadFillV = hasFit ? ("url(#" + gBrassDark + ")") : ("url(#" + gSteel + ")");
      const threadFillH = hasFit ? ("url(#" + gBrassDarkH + ")") : ("url(#" + gSteelH + ")");
      const hexTopCol = hasFit ? "#FEF08A" : "#E6ECF2";
      const hexMidCol = hasFit ? "#EAB308" : "#B4BFCB";
      const hexBotCol = hasFit ? "#B45309" : "#7D8896";
      const strokeCol = hasFit ? "#713F12" : "#5F6B79";
      const ferruleStroke = "#5F6B79";
      const threadCol = hasFit ? "#713F12" : "#5F6B79";

      const fx = (side === -1) ? 70 : 272;
      const fy = yBase - 12;

      const parts = [];

      /* Crimp ferrule with steel cylinder gradient, two thin ring lines, and highlight */
      parts.push(
        '<rect x="' + fx + '" y="' + fy + '" width="18" height="24" rx="2" fill="' + ferruleFill + '" stroke="' + ferruleStroke + '" stroke-width="1.5" />' +
        '<line x1="' + (fx + 1.5) + '" y1="' + (fy + 4.5) + '" x2="' + (fx + 16.5) + '" y2="' + (fy + 4.5) + '" stroke="#FFFFFF" stroke-width="1" opacity="0.55" />' +
        '<line x1="' + (fx + 6) + '" y1="' + fy + '" x2="' + (fx + 6) + '" y2="' + (fy + 24) + '" stroke="' + ferruleStroke + '" stroke-width="1.05" />' +
        '<line x1="' + (fx + 12) + '" y1="' + fy + '" x2="' + (fx + 12) + '" y2="' + (fy + 24) + '" stroke="' + ferruleStroke + '" stroke-width="1.05" />'
      );

      if (shape === "E") {
        /* 90-degree elbow bending downward */
        const dir = side;
        const startX = (dir === -1) ? 70 : 290;
        const turnX = (dir === -1) ? 48 : 312;
        const elbowD = "M " + startX + " " + yBase + " Q " + turnX + " " + yBase + " " + turnX + " " + (yBase + 22);

        parts.push(
          '<path d="' + elbowD + '" fill="none" stroke="' + strokeCol + '" stroke-width="16" stroke-linecap="butt" />' +
          '<path d="' + elbowD + '" fill="none" stroke="' + fittingFillV + '" stroke-width="12.5" stroke-linecap="butt" />' +
          '<path d="' + elbowD + '" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.4" transform="translate(0,-2.5)" />'
        );

        const tipY = yBase + 22;
        if (gender === "M") {
          /* Hex shoulder with 3 facet bands + downward male threads */
          parts.push(
            '<rect x="' + (turnX - 11) + '" y="' + tipY + '" width="7.3" height="9" fill="' + hexTopCol + '" />' +
            '<rect x="' + (turnX - 3.7) + '" y="' + tipY + '" width="7.4" height="9" fill="' + hexMidCol + '" />' +
            '<rect x="' + (turnX + 3.7) + '" y="' + tipY + '" width="7.3" height="9" fill="' + hexBotCol + '" />' +
            '<rect x="' + (turnX - 11) + '" y="' + tipY + '" width="22" height="9" rx="1.5" fill="none" stroke="' + strokeCol + '" stroke-width="1.4" />' +
            '<line x1="' + (turnX - 3.7) + '" y1="' + tipY + '" x2="' + (turnX - 3.7) + '" y2="' + (tipY + 9) + '" stroke="' + strokeCol + '" stroke-width="1" />' +
            '<line x1="' + (turnX + 3.7) + '" y1="' + tipY + '" x2="' + (turnX + 3.7) + '" y2="' + (tipY + 9) + '" stroke="' + strokeCol + '" stroke-width="1" />' +
            '<rect x="' + (turnX - 7) + '" y="' + (tipY + 9) + '" width="14" height="14" rx="1" fill="' + threadFillH + '" stroke="' + strokeCol + '" stroke-width="1.4" />'
          );
          for (let ty = tipY + 12; ty <= tipY + 21; ty += 3) {
            parts.push('<line x1="' + (turnX - 7) + '" y1="' + ty + '" x2="' + (turnX + 7) + '" y2="' + (ty + 1.2) + '" stroke="' + threadCol + '" stroke-width="1.2" />');
          }
        } else if (gender === "F") {
          /* Female swivel nut with cylinder shading, two ring lines, highlight, and dark bore */
          parts.push(
            '<rect x="' + (turnX - 13) + '" y="' + tipY + '" width="26" height="16" rx="2" fill="' + fittingFillH + '" stroke="' + strokeCol + '" stroke-width="1.5" />' +
            '<line x1="' + (turnX - 9) + '" y1="' + (tipY + 2) + '" x2="' + (turnX - 9) + '" y2="' + (tipY + 14) + '" stroke="#FFFFFF" stroke-width="1.1" opacity="0.55" />' +
            '<line x1="' + (turnX - 5.5) + '" y1="' + tipY + '" x2="' + (turnX - 5.5) + '" y2="' + (tipY + 16) + '" stroke="' + strokeCol + '" stroke-width="1.15" />' +
            '<line x1="' + (turnX + 5.5) + '" y1="' + tipY + '" x2="' + (turnX + 5.5) + '" y2="' + (tipY + 16) + '" stroke="' + strokeCol + '" stroke-width="1.15" />' +
            '<ellipse cx="' + turnX + '" cy="' + (tipY + 16) + '" rx="7" ry="2.6" fill="#1E293B" stroke="' + strokeCol + '" stroke-width="1.2" />'
          );
        } else {
          parts.push(
            '<rect x="' + (turnX - 9) + '" y="' + tipY + '" width="18" height="10" rx="1.5" fill="' + fittingFillH + '" stroke="' + strokeCol + '" stroke-width="1.4" />'
          );
        }
      } else {
        /* Straight fitting in line with hose */
        const dir = side;
        const neckX = (dir === -1) ? 58 : 290;
        parts.push(
          '<rect x="' + neckX + '" y="' + (yBase - 8) + '" width="12" height="16" fill="' + fittingFillV + '" stroke="' + strokeCol + '" stroke-width="1.4" />'
        );

        if (gender === "M") {
          const hexX = (dir === -1) ? 49 : 302;
          const spigX = (dir === -1) ? 33 : 311;
          parts.push(
            '<rect x="' + hexX + '" y="' + (yBase - 11) + '" width="9" height="7.3" fill="' + hexTopCol + '" />' +
            '<rect x="' + hexX + '" y="' + (yBase - 3.7) + '" width="9" height="7.4" fill="' + hexMidCol + '" />' +
            '<rect x="' + hexX + '" y="' + (yBase + 3.7) + '" width="9" height="7.3" fill="' + hexBotCol + '" />' +
            '<rect x="' + hexX + '" y="' + (yBase - 11) + '" width="9" height="22" rx="1.5" fill="none" stroke="' + strokeCol + '" stroke-width="1.4" />' +
            '<line x1="' + hexX + '" y1="' + (yBase - 3.7) + '" x2="' + (hexX + 9) + '" y2="' + (yBase - 3.7) + '" stroke="' + strokeCol + '" stroke-width="1" />' +
            '<line x1="' + hexX + '" y1="' + (yBase + 3.7) + '" x2="' + (hexX + 9) + '" y2="' + (yBase + 3.7) + '" stroke="' + strokeCol + '" stroke-width="1" />' +
            '<rect x="' + spigX + '" y="' + (yBase - 7) + '" width="16" height="14" rx="1" fill="' + threadFillV + '" stroke="' + strokeCol + '" stroke-width="1.4" />'
          );
          for (let tx = spigX + 3; tx <= spigX + 13; tx += 3.2) {
            parts.push('<line x1="' + tx + '" y1="' + (yBase - 7) + '" x2="' + (tx + 1.2) + '" y2="' + (yBase + 7) + '" stroke="' + threadCol + '" stroke-width="1.2" />');
          }
        } else if (gender === "F") {
          const nutX = (dir === -1) ? 41 : 302;
          const boreX = (dir === -1) ? 41 : 319;
          parts.push(
            '<rect x="' + nutX + '" y="' + (yBase - 13) + '" width="17" height="26" rx="2" fill="' + fittingFillV + '" stroke="' + strokeCol + '" stroke-width="1.5" />' +
            '<line x1="' + (nutX + 2) + '" y1="' + (yBase - 9) + '" x2="' + (nutX + 15) + '" y2="' + (yBase - 9) + '" stroke="#FFFFFF" stroke-width="1.1" opacity="0.55" />' +
            '<line x1="' + nutX + '" y1="' + (yBase - 5.5) + '" x2="' + (nutX + 17) + '" y2="' + (yBase - 5.5) + '" stroke="' + strokeCol + '" stroke-width="1.15" />' +
            '<line x1="' + nutX + '" y1="' + (yBase + 5.5) + '" x2="' + (nutX + 17) + '" y2="' + (yBase + 5.5) + '" stroke="' + strokeCol + '" stroke-width="1.15" />' +
            '<ellipse cx="' + boreX + '" cy="' + yBase + '" rx="2.6" ry="7" fill="#1E293B" stroke="' + strokeCol + '" stroke-width="1.2" />'
          );
        }
      }

      return parts.join("");
    };

    const hoseShadowSvg =
      '<ellipse cx="180" cy="' + (yBase + 11) + '" rx="108" ry="4.5" fill="#0F172A" opacity="0.12" />';

    const hoseSvg =
      defsSvg +
      hoseShadowSvg +
      '<path d="' + archD + '" fill="none" stroke="' + bodyStroke + '" stroke-width="24" stroke-linecap="butt" />' +
      '<path d="' + archD + '" fill="none" stroke="url(#' + gBody + ')" stroke-width="20.5" stroke-linecap="butt" />' +
      '<g clip-path="url(#' + gClip + ')">' +
        textureSvg +
        '<path d="' + archD + '" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="butt" opacity="' + stripeOpacity + '" transform="translate(0,-4.5)" />' +
      '</g>' +
      drawFitting(-1, e1Shape, e1Gender) +
      drawFitting(1, e2Shape, e2Gender);

    /* Labels */
    const reqColor = "#10302A";
    const optColor = "#0F3B33";
    const missingColor = "#64748B";

    /* Top Center Labels: Construction & Kind with pointer to hose body */
    const conLabel = construction ? ("Construction: " + construction) : "Construction: ?";
    const kindLabel = kind ? ("Kind: " + kind) : "Kind: ?";
    const conColor = construction ? reqColor : missingColor;
    const kindColor = kind ? reqColor : missingColor;
    const yTopLab1 = 62 + yOffset;
    const yTopLab2 = 79 + yOffset;
    const bodyMetaSvg =
      '<line x1="180" y1="' + (yTopLab2 + 6) + '" x2="180" y2="' + (yPeak - 3) + '" stroke="' + conColor + '" stroke-width="1.2" />' +
      '<circle cx="180" cy="' + (yPeak - 3) + '" r="2.2" fill="' + conColor + '" />' +
      '<text x="180" y="' + yTopLab1 + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + conColor + '">' + esc(conLabel) + '</text>' +
      '<text x="180" y="' + yTopLab2 + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + kindColor + '">' + esc(kindLabel) + '</text>';

    /* Middle under-arch: Length dimension arrow + Working Pressure */
    const yLenArrow = 174 + yOffset;
    const lenText = lengthVal ? ("Length: " + lengthVal + " m") : "Length: ?";
    const lenColor = lengthVal ? reqColor : missingColor;

    const unitFull = mod.meanings.unit[unitCode] || "";
    let wpText = "Pressure: ?";
    if (pressureVal && unitFull) {
      wpText = "Pressure: " + pressureVal + " " + unitFull;
    } else if (pressureVal) {
      wpText = "Pressure: " + pressureVal + " ?";
    } else if (unitFull) {
      wpText = "Pressure: ? " + unitFull;
    }
    const wpColor = (pressureVal && unitFull) ? reqColor : missingColor;

    const midLabelsSvg =
      '<line x1="92" y1="' + yLenArrow + '" x2="268" y2="' + yLenArrow + '" stroke="' + lenColor + '" stroke-width="1.3" />' +
      '<polygon points="88,' + yLenArrow + ' 95,' + (yLenArrow - 3.5) + ' 95,' + (yLenArrow + 3.5) + '" fill="' + lenColor + '" />' +
      '<polygon points="272,' + yLenArrow + ' 265,' + (yLenArrow - 3.5) + ' 265,' + (yLenArrow + 3.5) + '" fill="' + lenColor + '" />' +
      '<text x="180" y="' + (yLenArrow + 16) + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + lenColor + '">' + esc(lenText) + '</text>' +
      '<text x="180" y="' + (yLenArrow + 34) + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + wpColor + '">' + esc(wpText) + '</text>';

    /* Bottom Left & Right: END 1 and END 2 blocks with small pointer lines */
    const formatShape = function (sh) {
      if (sh === "E") return "Elbow (E)";
      if (sh === "S") return "Straight (S)";
      return "?";
    };
    const formatGender = function (gn) {
      if (gn === "M") return "Male (M)";
      if (gn === "F") return "Female (F)";
      return "?";
    };

    const drawEndBlock = function (isLeft, sz, sh, gn, th) {
      const title = isLeft ? "END 1" : "END 2";
      const xText = isLeft ? 16 : 344;
      const anchor = isLeft ? "start" : "end";
      const ptrX = isLeft ? 50 : 310;
      const ptrTargetY = (sh === "E") ? (yBase + 46) : (yBase + 15);
      const yStart = 236 + yOffset;

      const lines = [
        { text: title, color: reqColor, bold: true },
        { text: "Size: " + (sz || "?"), color: sz ? reqColor : missingColor },
        { text: "Shape: " + formatShape(sh), color: sh ? reqColor : missingColor },
        { text: "Gender: " + formatGender(gn), color: gn ? reqColor : missingColor }
      ];
      if (th) {
        lines.push({ text: "Thread: " + th, color: optColor });
      }

      const pointer =
        '<line x1="' + ptrX + '" y1="' + (yStart - 12) + '" x2="' + ptrX + '" y2="' + ptrTargetY + '" stroke="#475569" stroke-width="1.2" />' +
        '<circle cx="' + ptrX + '" cy="' + ptrTargetY + '" r="2.2" fill="#475569" />';

      const textSvg = lines.map(function (ln, idx) {
        const y = yStart + idx * 15;
        return (
          '<text x="' + xText + '" y="' + y + '" text-anchor="' + anchor + '" font-size="11.5" font-weight="' + (ln.bold ? "800" : "700") + '" fill="' + ln.color + '">' +
            esc(ln.text) +
          '</text>'
        );
      }).join("");

      return pointer + textSvg;
    };

    const end1Svg = drawEndBlock(true, e1Size, e1Shape, e1Gender, e1Thread);
    const end2Svg = drawEndBlock(false, e2Size, e2Shape, e2Gender, e2Thread);

    const hasAnyThread = Boolean(e1Thread || e2Thread);
    const totalHeight = (hasAnyThread ? 314 : 298) + yOffset;

    return (
      '<svg viewBox="0 0 360 ' + totalHeight + '" shape-rendering="geometricPrecision" role="img" aria-label="Hose technical drawing">' +
        '<rect x="0" y="0" width="360" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        bodyMetaSvg +
        '<g class="bolt-shape-animate">' +
          hoseSvg +
        '</g>' +
        midLabelsSvg +
        end1Svg +
        end2Svg +
      '</svg>'
    );
  },

  /* Draw the Hose screen */
  renderScreen: function (container, goBack) {
    const mod = this;

    const escAttr = function (s) {
      return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    function makeOptionsHtml(items, placeholderText) {
      const opts = ['<option value="">' + escAttr(placeholderText) + '</option>'];
      items.forEach(function (item) {
        const val = (typeof item === "object") ? item.code : item;
        const lbl = (typeof item === "object") ? item.label : item;
        opts.push('<option value="' + escAttr(val) + '">' + escAttr(lbl) + '</option>');
      });
      return opts.join("");
    }

    container.innerHTML =
      '<div class="item-header card-stagger" style="--card-index: 0;">' +
        '<button type="button" class="back-btn" id="hose-back-btn" aria-label="Back to Rules">' +
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
            '<button type="button" class="btn-secondary" id="hose-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="hose-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="hose-name-box" class="name-textarea" rows="2" aria-label="SAP Short Text" spellcheck="false" placeholder="PICK FIELDS BELOW TO BUILD NAME..."></textarea>' +

        '<div class="name-meta-row">' +
          '<span id="hose-char-counter" class="char-counter">0 / 40</span>' +
          '<p id="hose-missing-note" class="missing-note"></p>' +
        '</div>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 2;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Long text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="hose-long-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="hose-long-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="hose-long-box" class="name-textarea long-textarea" rows="3" aria-label="Long text" placeholder="Pick fields below to build long text..."></textarea>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 3;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Drawing</h2>' +
        '</div>' +
        '<div id="hose-drawing-frame" class="drawing-frame"></div>' +
      '</section>' +

      '<section class="card add-export-card card-stagger" style="--card-index: 4;">' +
        '<button type="button" class="btn-primary add-export-btn" id="hose-add-export-btn">Add to export list</button>' +
        '<p id="hose-export-feedback" class="add-export-feedback is-hidden" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card card-stagger" style="--card-index: 5;">' +
        '<div class="fields-grid">' +
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hose-construction">Construction</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="hose-construction" class="field-control">' +
              makeOptionsHtml(mod.lists.construction, "Select construction") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hose-kind">Kind</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="hose-kind" class="field-control">' +
              makeOptionsHtml(mod.lists.kind, "Select kind") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hose-length">Length in m</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<input id="hose-length" type="number" inputmode="decimal" min="0" step="any" class="field-control" placeholder="e.g. 1" />' +
          '</div>' +

          '<p class="fields-subsection-title">END 1</p>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hose-end1-size">Size</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="hose-end1-size" class="field-control">' +
              makeOptionsHtml(mod.lists.size, "Select size") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hose-end1-shape">Shape</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="hose-end1-shape" class="field-control">' +
              makeOptionsHtml(mod.lists.shape, "Select shape") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hose-end1-gender">Gender</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="hose-end1-gender" class="field-control">' +
              makeOptionsHtml(mod.lists.gender, "Select gender") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hose-end1-thread">Thread</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<input id="hose-end1-thread" type="text" class="field-control" placeholder="e.g. BSP" />' +
          '</div>' +

          '<p class="fields-subsection-title">END 2</p>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hose-end2-size">Size</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="hose-end2-size" class="field-control">' +
              makeOptionsHtml(mod.lists.size, "Select size") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hose-end2-shape">Shape</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="hose-end2-shape" class="field-control">' +
              makeOptionsHtml(mod.lists.shape, "Select shape") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hose-end2-gender">Gender</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="hose-end2-gender" class="field-control">' +
              makeOptionsHtml(mod.lists.gender, "Select gender") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hose-end2-thread">Thread</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<input id="hose-end2-thread" type="text" class="field-control" placeholder="e.g. BSP" />' +
          '</div>' +

          '<p class="fields-subsection-title">WORKING PRESSURE</p>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hose-pressure">Working pressure</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<input id="hose-pressure" type="number" inputmode="decimal" min="0" step="any" class="field-control" placeholder="e.g. 210" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hose-unit">Pressure unit</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="hose-unit" class="field-control">' +
              makeOptionsHtml(mod.lists.unit, "Select unit") +
            '</select>' +
          '</div>' +
        '</div>' +
      '</section>';

    const backBtn = document.getElementById("hose-back-btn");
    const nameBox = document.getElementById("hose-name-box");
    const charCounter = document.getElementById("hose-char-counter");
    const missingNote = document.getElementById("hose-missing-note");
    const rebuildBtn = document.getElementById("hose-rebuild-btn");
    const copyBtn = document.getElementById("hose-copy-btn");
    const longBox = document.getElementById("hose-long-box");
    const longRebuildBtn = document.getElementById("hose-long-rebuild-btn");
    const longCopyBtn = document.getElementById("hose-long-copy-btn");
    const drawingFrame = document.getElementById("hose-drawing-frame");
    const addExportBtn = document.getElementById("hose-add-export-btn");
    const exportFeedback = document.getElementById("hose-export-feedback");

    const inputs = {
      construction: document.getElementById("hose-construction"),
      kind: document.getElementById("hose-kind"),
      length: document.getElementById("hose-length"),
      end1Size: document.getElementById("hose-end1-size"),
      end1Shape: document.getElementById("hose-end1-shape"),
      end1Gender: document.getElementById("hose-end1-gender"),
      end1Thread: document.getElementById("hose-end1-thread"),
      end2Size: document.getElementById("hose-end2-size"),
      end2Shape: document.getElementById("hose-end2-shape"),
      end2Gender: document.getElementById("hose-end2-gender"),
      end2Thread: document.getElementById("hose-end2-thread"),
      pressure: document.getElementById("hose-pressure"),
      unit: document.getElementById("hose-unit")
    };

    function readFieldValues() {
      return {
        construction: inputs.construction.value,
        kind: inputs.kind.value,
        length: inputs.length.value,
        end1Size: inputs.end1Size.value,
        end1Shape: inputs.end1Shape.value,
        end1Gender: inputs.end1Gender.value,
        end1Thread: inputs.end1Thread.value,
        end2Size: inputs.end2Size.value,
        end2Shape: inputs.end2Shape.value,
        end2Gender: inputs.end2Gender.value,
        end2Thread: inputs.end2Thread.value,
        pressure: inputs.pressure.value,
        unit: inputs.unit.value
      };
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
      nameBox.value = mod.buildShortText(readFieldValues());
      updateStatusDisplay();
      updateDrawing();
      clearExportFeedback();
    }

    function rebuildLongFromFields() {
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
      el.addEventListener("input", rebuildAllFromFields);
      el.addEventListener("change", rebuildAllFromFields);
    });

    nameBox.addEventListener("input", function () {
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
        fields: {
          construction: String(values.construction || "").trim(),
          kind: String(values.kind || "").trim(),
          length: String(values.length || "").trim(),
          end1Size: String(values.end1Size || "").trim(),
          end1Shape: String(values.end1Shape || "").trim(),
          end1Gender: String(values.end1Gender || "").trim(),
          end1Thread: String(values.end1Thread || "").trim(),
          end2Size: String(values.end2Size || "").trim(),
          end2Shape: String(values.end2Shape || "").trim(),
          end2Gender: String(values.end2Gender || "").trim(),
          end2Thread: String(values.end2Thread || "").trim(),
          pressure: String(values.pressure || "").trim(),
          unit: String(values.unit || "").trim()
        },
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
