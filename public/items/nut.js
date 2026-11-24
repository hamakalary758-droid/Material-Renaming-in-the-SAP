/* ----- NUT MODULE ----- */
window.QS_MODULES.push({
  id: "nut",
  name: "Nut",
  searchWords: ["nut", "nuts", "nyloc", "lock"],
  tileBg: "#C4EFE0",
  tileColor: "#0A2E25",
  iconSvg:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polygon points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5"></polygon>' +
      '<circle cx="12" cy="12" r="4"></circle>' +
    '</svg>',

  /* SAP export defaults for Nut */
  exportDefaults: {
    materialType: "ERSA",
    baseUnit: "EA",
    materialGroup: "Mechanical"
  },

  /* Easy-to-edit Nut dropdown lists */
  lists: {
    material: ["MS", "SS", "GI", "HT", "COPPER"],
    type: ["HEX", "NYLOC", "SELF LOCKING", "THIN", "JAM", "COUPLING"],
    diameter: ["M6", "M8", "M10", "M12", "M14", "M16", "M18", "M20", "M22", "M24", "M27", "M30"],
    grade: ["G8.8", "G10.9", "G12.9", "A2-70"]
  },

  /* Easy-to-edit material colors for the drawing (NYLOC ring stays dark blue) */
  materialColors: {
    "MS": { c1: "#E3E8ED", c2: "#A9B4BF", c3: "#5E6B78", cs: "#3B4856" },
    "GI": { c1: "#F6E7A6", c2: "#D8B94E", c3: "#8C7420", cs: "#6B5A18" },
    "SS": { c1: "#FFFFFF", c2: "#D5DCE4", c3: "#7D8896", cs: "#5A6572" },
    "HT": { c1: "#7B8794", c2: "#3B4551", c3: "#11161C", cs: "#0B0F13" },
    "COPPER": { c1: "#F2B58A", c2: "#E08A54", c3: "#A8501F", cs: "#6E3213" }
  },

  /* Easy-to-edit plain-word meanings for Long text */
  meanings: {
    material: {
      "MS": "mild steel",
      "SS": "stainless steel",
      "GI": "galvanized iron",
      "HT": "high tensile steel",
      "COPPER": "copper"
    },
    type: {
      "HEX": "hexagon nut",
      "NYLOC": "nylon insert lock nut",
      "SELF LOCKING": "self locking nut",
      "THIN": "thin hexagon nut",
      "JAM": "jam nut (thin lock nut)",
      "COUPLING": "long coupling nut"
    },
    grade: {
      "G8.8": "strength grade 8.8",
      "G10.9": "strength grade 10.9",
      "G12.9": "strength grade 12.9",
      "A2-70": "stainless steel A2, strength class 70"
    }
  },

  /* Build SAP Short Text (max 40 chars) from current values */
  buildShortText: function (values) {
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ").toUpperCase();
    };

    const material = clean(values.material);
    const type = clean(values.type);
    const diameter = clean(values.diameter);
    const pitch = clean(values.pitch);
    const grade = clean(values.grade);
    const machine = clean(values.machine);

    const hasAnyField = Boolean(
      material || type || diameter || pitch || grade || machine
    );
    if (!hasAnyField) {
      return "";
    }

    const size = [diameter, pitch].filter(Boolean).join("X");
    const forMachine = machine
      ? (/^FOR(?:\s|$)/.test(machine) ? machine : ("FOR " + machine))
      : "";

    return [material, type, "NUT", size, grade, forMachine]
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

    const matCode = upper(values.material);
    const typeCode = upper(values.type);
    const diaCode = upper(values.diameter);
    const pitchVal = clean(values.pitch);
    const gradeCode = upper(values.grade);
    const machineVal = clean(values.machine);

    const matText = mod.meanings.material[matCode] || "";
    const typeText = mod.meanings.type[typeCode] || "";
    const leadPhrase = [matText, typeText].filter(Boolean).join(" ");

    const parts = [];
    if (leadPhrase) {
      parts.push(leadPhrase);
    }

    if (diaCode) {
      if (diaCode.charAt(0) === "M") {
        parts.push("metric");
        parts.push("diameter " + diaCode.slice(1) + " mm");
      } else {
        parts.push("diameter " + diaCode + " mm");
      }
    }

    if (pitchVal) {
      parts.push("pitch " + pitchVal + " mm");
    }

    const gradeText = mod.meanings.grade[gradeCode] || "";
    if (gradeText) {
      parts.push(gradeText);
    }

    let sentence = "";
    if (parts.length > 0) {
      const joined = parts.join(", ");
      sentence = joined.charAt(0).toUpperCase() + joined.slice(1) + ".";
    }

    if (machineVal) {
      const machineClause = "For machine: " + machineVal + ".";
      sentence = sentence ? (sentence + " " + machineClause) : machineClause;
    }

    return sentence;
  },

  /* Find which Required fields are still empty */
  getMissingRequired: function (values) {
    const missing = [];
    if (!String(values.type || "").trim()) missing.push("Type");
    if (!String(values.diameter || "").trim()) missing.push("Diameter");
    if (!String(values.grade || "").trim()) missing.push("Grade");
    return missing;
  },

  /* Build clean side-view + head-view SVG drawing with 3D shading & size scaling */
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
    const f2 = function (n) {
      return Number(n.toFixed(2));
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
    const hexPoints = function (hx, hy, rad) {
      const pts = [];
      for (let k = 0; k < 6; k++) {
        const ang = (k * 60) * Math.PI / 180;
        pts.push(f2(hx + rad * Math.cos(ang)) + "," + f2(hy + rad * Math.sin(ang)));
      }
      return pts.join(" ");
    };

    const material = upper(values.material);
    const type = upper(values.type);
    const diameter = upper(values.diameter);
    const pitch = clean(values.pitch);
    const grade = upper(values.grade);
    const machine = clean(values.machine);

    /* Palette (c1 light, c2 mid, c3 dark, cs outline) */
    const defaultPal = { c1: "#F1F5F9", c2: "#D5DCE3", c3: "#94A3B8", cs: "#64748B" };
    const pal = (material && mod.materialColors && mod.materialColors[material])
      ? mod.materialColors[material]
      : defaultPal;
    const c1 = pal.c1;
    const c2 = pal.c2;
    const c3 = pal.c3;
    const cs = pal.cs;

    /* Unique gradient ID prefix per drawing */
    mod._svgUid = (mod._svgUid || 0) + 1;
    const uid = "nut-g" + mod._svgUid + "-" + Math.random().toString(36).slice(2, 6);
    const gHeadL = uid + "-hl";
    const gHeadC = uid + "-hc";
    const gHeadR = uid + "-hr";
    const gHeadV = uid + "-hv";
    const gNylon = uid + "-nylon";

    const defsSvg =
      "<defs>" +
        '<linearGradient id="' + gHeadL + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="' + c2 + '" />' +
          '<stop offset="55%" stop-color="' + c1 + '" />' +
          '<stop offset="100%" stop-color="' + c2 + '" />' +
        "</linearGradient>" +
        '<linearGradient id="' + gHeadC + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="' + c1 + '" />' +
          '<stop offset="55%" stop-color="' + c2 + '" />' +
          '<stop offset="100%" stop-color="' + c3 + '" />' +
        "</linearGradient>" +
        '<linearGradient id="' + gHeadR + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="' + c2 + '" />' +
          '<stop offset="100%" stop-color="' + c3 + '" />' +
        "</linearGradient>" +
        '<linearGradient id="' + gHeadV + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="' + c1 + '" />' +
          '<stop offset="55%" stop-color="' + c2 + '" />' +
          '<stop offset="100%" stop-color="' + c3 + '" />' +
        "</linearGradient>" +
        '<linearGradient id="' + gNylon + '" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="#3B82F6" />' +
          '<stop offset="35%" stop-color="#1E3A8A" />' +
          '<stop offset="100%" stop-color="#172554" />' +
        "</linearGradient>" +
      "</defs>";

    /* Top short-name lines */
    const topText = clean(shortNameText);
    const topLines = topText ? wrapLines(topText, 36) : ["NEW NUT"];
    const topIsPlaceholder = !topText;
    const topShift = Math.max(0, topLines.length - 1) * 15;

    const topSvg = topLines.map(function (line, i) {
      const y = 22 + i * 15;
      const color = topIsPlaceholder ? "#94A3B8" : "#10302A";
      return (
        '<text x="190" y="' + y + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + color + '">' +
          esc(line) +
        "</text>"
      );
    }).join("");

    /* Size scaling calculations */
    const dMatch = diameter.match(/^M(\d+(?:\.\d+)?)$/);
    const dParsed = dMatch ? parseFloat(dMatch[1]) : NaN;
    const dNum = (!isNaN(dParsed) && dParsed > 0) ? dParsed : 16;

    const W = 1.73 * dNum;
    let hFactor = 0.8;
    if (type === "THIN" || type === "JAM") hFactor = 0.5;
    else if (type === "SELF LOCKING") hFactor = 0.9;
    else if (type === "NYLOC") hFactor = 1.2;
    else if (type === "COUPLING") hFactor = 3.0;

    const hNum = hFactor * dNum;
    const sc = Math.min(6, 120 / hNum, 110 / W);

    const nutW = W * sc;
    const totalH = hNum * sc;
    const boreW = dNum * sc;

    const PITCH_TABLE = {
      4: 0.7, 5: 0.8, 6: 1, 7: 1, 8: 1.25, 10: 1.5, 12: 1.75, 14: 2,
      16: 2, 18: 2.5, 20: 2.5, 22: 2.5, 24: 3, 27: 3, 30: 3.5, 36: 4, 42: 4.5
    };
    const stdPitch = PITCH_TABLE[Math.round(dNum)] || Math.max(0.7, dNum * 0.125);
    const threadStep = Math.max(stdPitch * sc, 4);

    /* Geometry anchored around cx = 166 */
    const cx = 166;
    const xL = cx - nutW / 2;
    const xR = cx + nutW / 2;
    const fW = nutW / 4;
    const xF1 = xL + fW;
    const xF2 = xR - fW;
    const xBoreL = cx - boreW / 2;
    const xBoreR = cx + boreW / 2;
    const yOffset = topShift;

    const drawHexBody = function (yTop, yBot) {
      const bodyH = Math.max(8, yBot - yTop);
      const hRound = Math.max(1.8, Math.min(4.5, bodyH * 0.14));

      const leftFace =
        "M " + f2(xL) + " " + f2(yBot - hRound) +
        " V " + f2(yTop + hRound) +
        " Q " + f2(xL) + " " + f2(yTop) + " " + f2(xF1) + " " + f2(yTop) +
        " V " + f2(yBot) +
        " Q " + f2(xL) + " " + f2(yBot) + " " + f2(xL) + " " + f2(yBot - hRound) + " Z";

      const centerFace =
        "M " + f2(xF1) + " " + f2(yBot) +
        " V " + f2(yTop) +
        " Q " + cx + " " + f2(yTop - hRound * 0.65) + " " + f2(xF2) + " " + f2(yTop) +
        " V " + f2(yBot) +
        " Q " + cx + " " + f2(yBot + hRound * 0.65) + " " + f2(xF1) + " " + f2(yBot) + " Z";

      const rightFace =
        "M " + f2(xF2) + " " + f2(yBot) +
        " V " + f2(yTop) +
        " Q " + f2(xR) + " " + f2(yTop) + " " + f2(xR) + " " + f2(yTop + hRound) +
        " V " + f2(yBot - hRound) +
        " Q " + f2(xR) + " " + f2(yBot) + " " + f2(xF2) + " " + f2(yBot) + " Z";

      /* Bore curved thread lines */
      const bx1 = f2(xBoreL + 1);
      const bx2 = f2(xBoreR - 1);
      const dip = Math.max(1.2, Math.min(2.6, boreW * 0.06));
      const slope = Math.max(0.7, Math.min(1.8, threadStep * 0.25));
      const threadCurves = [];
      for (let ty = yTop + 3.5; ty <= yBot - 3.5; ty += threadStep) {
        const ya = f2(ty);
        const yb = f2(ty + slope);
        const yCtrl = f2((ya + yb) * 0.5 + dip);
        threadCurves.push(
          '<path d="M ' + bx1 + " " + ya + " Q " + cx + " " + yCtrl + " " + bx2 + " " + yb + '" fill="none" stroke="' + c3 + '" stroke-width="1.35" stroke-linecap="round" opacity="0.72" />' +
          '<path d="M ' + bx1 + " " + f2(ya + 0.9) + " Q " + cx + " " + f2(yCtrl + 0.9) + " " + bx2 + " " + f2(yb + 0.9) + '" fill="none" stroke="#FFFFFF" stroke-width="0.75" stroke-linecap="round" opacity="0.4" />'
        );
      }

      return (
        '<path d="' + leftFace + '" fill="url(#' + gHeadL + ')" stroke="' + cs + '" stroke-width="1.1" stroke-linejoin="round" />' +
        '<path d="' + centerFace + '" fill="url(#' + gHeadC + ')" stroke="' + cs + '" stroke-width="1.1" stroke-linejoin="round" />' +
        '<path d="' + rightFace + '" fill="url(#' + gHeadR + ')" stroke="' + cs + '" stroke-width="1.1" stroke-linejoin="round" />' +
        '<line x1="' + f2(xBoreL) + '" y1="' + f2(yTop + 1) + '" x2="' + f2(xBoreL) + '" y2="' + f2(yBot - 1) + '" stroke="' + c3 + '" stroke-width="1.3" stroke-dasharray="3 2.5" />' +
        '<line x1="' + f2(xBoreR) + '" y1="' + f2(yTop + 1) + '" x2="' + f2(xBoreR) + '" y2="' + f2(yBot - 1) + '" stroke="' + c3 + '" stroke-width="1.3" stroke-dasharray="3 2.5" />' +
        threadCurves.join("")
      );
    };

    const dimTopY = (type === "COUPLING" ? 74 : 90) + yOffset;
    const nutTopY = dimTopY;
    const nutBotY = dimTopY + totalH;

    let shapeSvg = "";
    let typeTargetX = xR;
    let typeTargetY = nutTopY + totalH * 0.25;
    let matTargetY = nutTopY + totalH * 0.5;
    let gradeTargetY = nutTopY + totalH * 0.78;

    if (type === "NYLOC") {
      const hexH = 0.8 * dNum * sc;
      const ringH = 0.4 * dNum * sc;
      const yRingTop = dimTopY;
      const yHexTop = dimTopY + ringH;
      const yHexBot = nutBotY;

      const nylonW = nutW * 0.72;
      const nL = cx - nylonW / 2;
      const nR = cx + nylonW / 2;
      const collarTopY = yRingTop + ringH * 0.48;
      const collarWTop = nutW * 0.80;
      const collarWBot = nutW * 0.92;

      typeTargetX = nR;
      typeTargetY = yRingTop + ringH * 0.45;
      matTargetY = yHexTop + hexH * 0.45;
      gradeTargetY = yHexTop + hexH * 0.78;

      shapeSvg =
        '<rect x="' + f2(nL) + '" y="' + f2(yRingTop) + '" width="' + f2(nylonW) + '" height="' + f2(ringH + 2) + '" rx="' + f2(Math.min(10, ringH * 0.52)) + '" fill="url(#' + gNylon + ')" stroke="#0F172A" stroke-width="1.2" />' +
        '<line x1="' + f2(nL + nylonW * 0.14) + '" y1="' + f2(yRingTop + Math.max(2.5, ringH * 0.24)) + '" x2="' + f2(nR - nylonW * 0.14) + '" y2="' + f2(yRingTop + Math.max(2.5, ringH * 0.24)) + '" stroke="#93C5FD" stroke-width="1.3" stroke-linecap="round" opacity="0.75" />' +
        '<line x1="' + f2(xBoreL) + '" y1="' + f2(yRingTop + 1) + '" x2="' + f2(xBoreL) + '" y2="' + f2(yHexTop) + '" stroke="#93C5FD" stroke-width="1.15" stroke-dasharray="2.5 2" />' +
        '<line x1="' + f2(xBoreR) + '" y1="' + f2(yRingTop + 1) + '" x2="' + f2(xBoreR) + '" y2="' + f2(yHexTop) + '" stroke="#93C5FD" stroke-width="1.15" stroke-dasharray="2.5 2" />' +
        '<path d="M ' + f2(cx - collarWBot / 2) + " " + f2(yHexTop) + " L " + f2(cx - collarWTop / 2) + " " + f2(collarTopY) + " H " + f2(cx + collarWTop / 2) + " L " + f2(cx + collarWBot / 2) + " " + f2(yHexTop) + ' Z" fill="url(#' + gHeadC + ')" stroke="' + cs + '" stroke-width="1.1" stroke-linejoin="round" />' +
        drawHexBody(yHexTop, yHexBot);
    } else if (type === "SELF LOCKING") {
      const coneH = totalH * 0.26;
      const yHexTop = dimTopY + coneH;
      const yHexBot = nutBotY;
      const coneWTop = nutW * 0.72;
      const coneWBot = nutW * 0.90;

      typeTargetX = cx + (coneWTop + coneWBot) * 0.25;
      typeTargetY = dimTopY + coneH * 0.5;
      matTargetY = yHexTop + (yHexBot - yHexTop) * 0.45;
      gradeTargetY = yHexTop + (yHexBot - yHexTop) * 0.78;

      const slotD = Math.max(4, coneH * 0.58);
      shapeSvg =
        '<path d="M ' + f2(cx - coneWBot / 2) + " " + f2(yHexTop) + " L " + f2(cx - coneWTop / 2) + " " + f2(dimTopY) + " H " + f2(cx + coneWTop / 2) + " L " + f2(cx + coneWBot / 2) + " " + f2(yHexTop) + ' Z" fill="url(#' + gHeadC + ')" stroke="' + cs + '" stroke-width="1.1" stroke-linejoin="round" />' +
        '<path d="M ' + f2(cx - coneWTop * 0.26) + " " + f2(dimTopY) + " v " + f2(slotD) + " M " + cx + " " + f2(dimTopY) + " v " + f2(slotD) + " M " + f2(cx + coneWTop * 0.26) + " " + f2(dimTopY) + " v " + f2(slotD) + '" stroke="' + cs + '" stroke-width="1.3" stroke-linecap="round" />' +
        '<line x1="' + f2(xBoreL) + '" y1="' + f2(dimTopY + 1) + '" x2="' + f2(xBoreL) + '" y2="' + f2(yHexTop) + '" stroke="' + c3 + '" stroke-width="1.2" stroke-dasharray="2.5 2" />' +
        '<line x1="' + f2(xBoreR) + '" y1="' + f2(dimTopY + 1) + '" x2="' + f2(xBoreR) + '" y2="' + f2(yHexTop) + '" stroke="' + c3 + '" stroke-width="1.2" stroke-dasharray="2.5 2" />' +
        drawHexBody(yHexTop, yHexBot);
    } else {
      /* HEX, THIN, JAM, COUPLING, or No Type chosen yet */
      shapeSvg = drawHexBody(dimTopY, nutBotY);
    }

    /* Head view (top view on the right, radius = W * sc / 2 clamped 14..30) */
    const hx = 304;
    const hvRadius = Math.max(14, Math.min(30, nutW / 2));
    const holeR = Math.max(4, Math.min(0.5 * boreW, hvRadius * 0.44));
    const hy = Math.round(188 + hvRadius + yOffset);
    const hvLabelY = hy - hvRadius - 12;

    let headShapeSvg = "";
    if (type === "NYLOC") {
      const nylonOuterR = Math.min(hvRadius * 0.70, Math.max(holeR + 3.5, holeR * 1.4));
      const threadRingR = (holeR + nylonOuterR) * 0.5;
      headShapeSvg =
        '<polygon points="' + hexPoints(hx, hy, hvRadius) + '" fill="url(#' + gHeadV + ')" stroke="' + cs + '" stroke-width="1.15" stroke-linejoin="round" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius * 0.78) + '" fill="none" stroke="' + cs + '" stroke-width="0.9" opacity="0.55" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(nylonOuterR) + '" fill="url(#' + gNylon + ')" stroke="#0F172A" stroke-width="1.2" />' +
        '<path d="M ' + f2(hx - nylonOuterR * 0.6) + " " + f2(hy - nylonOuterR * 0.5) + " A " + f2(nylonOuterR * 0.75) + " " + f2(nylonOuterR * 0.75) + " 0 0 1 " + f2(hx + nylonOuterR * 0.35) + " " + f2(hy - nylonOuterR * 0.68) + '" fill="none" stroke="#93C5FD" stroke-width="1.2" stroke-linecap="round" opacity="0.8" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(threadRingR) + '" fill="none" stroke="' + c3 + '" stroke-width="0.9" stroke-dasharray="2.5 2" opacity="0.85" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(holeR) + '" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.2" />';
    } else {
      const threadRingR = Math.min(hvRadius * 0.72, holeR + Math.max(2.4, holeR * 0.24));
      headShapeSvg =
        '<polygon points="' + hexPoints(hx, hy, hvRadius) + '" fill="url(#' + gHeadV + ')" stroke="' + cs + '" stroke-width="1.15" stroke-linejoin="round" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius * 0.78) + '" fill="none" stroke="' + cs + '" stroke-width="0.9" opacity="0.55" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(threadRingR) + '" fill="none" stroke="' + c3 + '" stroke-width="1.1" stroke-dasharray="3 2" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(holeR) + '" fill="#FFFFFF" stroke="' + cs + '" stroke-width="1.3" />';
    }

    const gradeTextClean = grade ? (grade.charAt(0) === "G" ? grade.slice(1) : grade) : "";
    let headGradeSvg = "";
    if (gradeTextClean) {
      const maxFs = gradeTextClean.length > 4 ? Math.min(9.5, holeR * 0.68) : Math.min(10.5, holeR * 0.86);
      const gFs = Math.max(6.8, maxFs);
      headGradeSvg =
        '<text x="' + hx + '" y="' + f2(hy + gFs * 0.35) + '" text-anchor="middle" font-size="' + f2(gFs) + '" font-weight="800" fill="' + cs + '">' +
          esc(gradeTextClean) +
        "</text>";
    }

    const headViewSvg =
      '<g class="head-view-animate">' +
        '<text x="' + hx + '" y="' + f2(hvLabelY) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#476B62">Head view</text>' +
        headShapeSvg +
        headGradeSvg +
      "</g>";

    /* Dimension & Pointer Labels (non-overlapping fixed columns) */
    const reqColor = "#10302A";
    const optColor = "#0F3B33";
    const missingColor = "#64748B";

    /* Left side: Diameter across internal bore above nut */
    const xLeftText = 98;
    const yDiaBar = dimTopY - 22;
    const diaLabel = diameter ? ("Diameter: " + diameter) : "Diameter: ?";
    const diaColor = diameter ? reqColor : missingColor;
    const diaSvg =
      '<line x1="' + f2(xBoreL) + '" y1="' + f2(yDiaBar - 4) + '" x2="' + f2(xBoreL) + '" y2="' + f2(nutTopY) + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2.5 2.5" />' +
      '<line x1="' + f2(xBoreR) + '" y1="' + f2(yDiaBar - 4) + '" x2="' + f2(xBoreR) + '" y2="' + f2(nutTopY) + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2.5 2.5" />' +
      '<line x1="' + (xLeftText + 4) + '" y1="' + f2(yDiaBar) + '" x2="' + f2(xBoreR) + '" y2="' + f2(yDiaBar) + '" stroke="' + diaColor + '" stroke-width="1.15" />' +
      '<polygon points="' + f2(xBoreL) + "," + f2(yDiaBar) + " " + f2(xBoreL - 5) + "," + f2(yDiaBar - 3) + " " + f2(xBoreL - 5) + "," + f2(yDiaBar + 3) + '" fill="' + diaColor + '" />' +
      '<polygon points="' + f2(xBoreR) + "," + f2(yDiaBar) + " " + f2(xBoreR + 5) + "," + f2(yDiaBar - 3) + " " + f2(xBoreR + 5) + "," + f2(yDiaBar + 3) + '" fill="' + diaColor + '" />' +
      '<text x="' + xLeftText + '" y="' + f2(yDiaBar + 4) + '" text-anchor="end" font-size="11.5" font-weight="700" fill="' + diaColor + '">' + esc(diaLabel) + "</text>";

    /* Left side: Pitch (only if filled) */
    let pitchSvg = "";
    if (pitch) {
      const yPitchTarget = (nutTopY + nutBotY) * 0.55;
      const yPitchLabel = Math.max(yDiaBar + 22, yPitchTarget + 16);
      pitchSvg =
        '<polyline points="' + (xLeftText + 4) + "," + f2(yPitchLabel) + " " + (xLeftText + 10) + "," + f2(yPitchLabel) + " " + f2(xBoreL) + "," + f2(yPitchTarget) + '" fill="none" stroke="' + optColor + '" stroke-width="1.05" />' +
        '<circle cx="' + f2(xBoreL) + '" cy="' + f2(yPitchTarget) + '" r="2" fill="' + optColor + '" />' +
        '<text x="' + xLeftText + '" y="' + f2(yPitchLabel + 4) + '" text-anchor="end" font-size="11.5" font-weight="700" fill="' + optColor + '">Pitch: ' + esc(pitch) + "</text>";
    }

    /* Fixed right-side label column (x = 236) */
    const xLabelCol = 236;
    const rightPointer = function (yLabel, yTarget, xTarget, labelText, color) {
      const fontSize = labelText.length > 15 ? "11" : "11.5";
      return (
        '<polyline points="' + f2(xTarget) + "," + f2(yTarget) + " " + (xLabelCol - 10) + "," + f2(yLabel) + " " + (xLabelCol - 4) + "," + f2(yLabel) + '" fill="none" stroke="' + color + '" stroke-width="1" />' +
        '<circle cx="' + f2(xTarget) + '" cy="' + f2(yTarget) + '" r="2" fill="' + color + '" />' +
        '<text x="' + xLabelCol + '" y="' + f2(yLabel + 4) + '" text-anchor="start" font-size="' + fontSize + '" font-weight="700" fill="' + color + '">' + esc(labelText) + "</text>"
      );
    };

    const typeLabel = type ? ("Type: " + type) : "Type: ?";
    const typeSvg = rightPointer(74 + yOffset, typeTargetY, typeTargetX, typeLabel, type ? reqColor : missingColor);

    let materialSvg = "";
    if (material) {
      const yMat = 102 + yOffset;
      const matText = "Material: " + material;
      const matFs = matText.length > 14 ? "11" : "11.5";
      materialSvg =
        '<polyline points="' + f2(xR) + "," + f2(matTargetY) + " " + (xLabelCol - 10) + "," + yMat + " " + (xLabelCol - 4) + "," + yMat + '" fill="none" stroke="' + optColor + '" stroke-width="1" />' +
        '<circle cx="' + f2(xR) + '" cy="' + f2(matTargetY) + '" r="2" fill="' + optColor + '" />' +
        '<circle cx="' + (xLabelCol + 4) + '" cy="' + yMat + '" r="5" fill="' + c2 + '" stroke="' + cs + '" stroke-width="1" />' +
        '<text x="' + (xLabelCol + 13) + '" y="' + (yMat + 4) + '" text-anchor="start" font-size="' + matFs + '" font-weight="700" fill="' + optColor + '">' + esc(matText) + "</text>";
    }

    const gradeLabel = grade ? ("Grade: " + grade) : "Grade: ?";
    const gradeSvg = rightPointer(130 + yOffset, gradeTargetY, xR, gradeLabel, grade ? reqColor : missingColor);

    /* Scale bar at bottom (10, 20, 50, 100 or 200 mm -> 30..100 px) */
    const scaleCandidates = [10, 20, 50, 100, 200];
    let scaleMm = 20;
    let bestDist = Infinity;
    let foundInRange = false;
    scaleCandidates.forEach(function (cand) {
      const px = cand * sc;
      if (px >= 30 && px <= 100) {
        foundInRange = true;
        const dist = Math.abs(px - 55);
        if (dist < bestDist) {
          bestDist = dist;
          scaleMm = cand;
        }
      }
    });
    if (!foundInRange) {
      scaleMm = (10 * sc > 100) ? 10 : 200;
    }
    const scalePx = Math.max(12, Math.min(140, scaleMm * sc));
    const yScale = Math.max(nutBotY + 24, hy + hvRadius + 24);
    const xScale1 = f2(cx - scalePx / 2);
    const xScale2 = f2(cx + scalePx / 2);
    const scaleBarSvg =
      '<g class="nut-scale-bar">' +
        '<line x1="' + xScale1 + '" y1="' + f2(yScale) + '" x2="' + xScale2 + '" y2="' + f2(yScale) + '" stroke="#476B62" stroke-width="1.4" />' +
        '<line x1="' + xScale1 + '" y1="' + f2(yScale - 4) + '" x2="' + xScale1 + '" y2="' + f2(yScale + 4) + '" stroke="#476B62" stroke-width="1.4" />' +
        '<line x1="' + xScale2 + '" y1="' + f2(yScale - 4) + '" x2="' + xScale2 + '" y2="' + f2(yScale + 4) + '" stroke="#476B62" stroke-width="1.4" />' +
        '<text x="' + cx + '" y="' + f2(yScale + 14) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#476B62">' + scaleMm + " mm</text>" +
      "</g>";

    /* Bottom: For machine (only if filled, wraps cleanly below scale bar) */
    let machineSvg = "";
    let machineHeight = 0;
    if (machine) {
      const machineLines = wrapLines("For machine: " + machine, 40);
      machineHeight = machineLines.length * 16 + 8;
      machineSvg = machineLines.map(function (line, i) {
        const y = yScale + 34 + i * 16;
        return (
          '<text x="190" y="' + f2(y) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#0F3B33">' +
            esc(line) +
          "</text>"
        );
      }).join("");
    }

    const totalHeight = Math.round(yScale + 26 + machineHeight);

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" shape-rendering="geometricPrecision" role="img" aria-label="Nut technical drawing">' +
        defsSvg +
        '<rect x="0" y="0" width="380" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        '<g class="bolt-shape-animate">' +
          shapeSvg +
        "</g>" +
        headViewSvg +
        diaSvg +
        pitchSvg +
        typeSvg +
        materialSvg +
        gradeSvg +
        scaleBarSvg +
        machineSvg +
      "</svg>"
    );
  },

  /* Draw the Nut screen */
  renderScreen: function (container, goBack) {
    const mod = this;

    function escAttr(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function makeOptionsHtml(items, placeholderText) {
      const opts = ['<option value="">' + escAttr(placeholderText) + '</option>'];
      items.forEach(function (item) {
        opts.push('<option value="' + escAttr(item) + '">' + escAttr(item) + '</option>');
      });
      return opts.join("");
    }

    container.innerHTML =
      '<div class="item-header card-stagger" style="--card-index: 0;">' +
        '<button type="button" class="back-btn" id="nut-back-btn" aria-label="Back to Rules">' +
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
            '<button type="button" class="btn-secondary" id="nut-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="nut-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="nut-name-box" class="name-textarea" rows="2" aria-label="SAP Short Text" autocapitalize="characters" spellcheck="false" placeholder="PICK FIELDS BELOW TO BUILD NAME..."></textarea>' +

        '<div class="name-meta-row">' +
          '<span id="nut-char-counter" class="char-counter">0 / 40</span>' +
          '<p id="nut-missing-note" class="missing-note"></p>' +
        '</div>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 2;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Long text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="nut-long-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="nut-long-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="nut-long-box" class="name-textarea long-textarea" rows="3" aria-label="Long text" placeholder="Pick fields below to build long text..."></textarea>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 3;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Drawing</h2>' +
        '</div>' +
        '<div id="nut-drawing-frame" class="drawing-frame"></div>' +
      '</section>' +

      '<section class="card add-export-card card-stagger" style="--card-index: 4;">' +
        '<button type="button" class="btn-primary add-export-btn" id="nut-add-export-btn">Add to export list</button>' +
        '<p id="nut-export-feedback" class="add-export-feedback is-hidden" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card card-stagger" style="--card-index: 5;">' +
        '<div class="fields-grid">' +
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nut-material">Material</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="nut-material" class="field-control">' +
              makeOptionsHtml(mod.lists.material, "Select material") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nut-type">Type</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="nut-type" class="field-control">' +
              makeOptionsHtml(mod.lists.type, "Select type") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nut-diameter">Diameter</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="nut-diameter" class="field-control">' +
              makeOptionsHtml(mod.lists.diameter, "Select diameter") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nut-pitch">Pitch</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<input id="nut-pitch" type="text" inputmode="decimal" class="field-control" placeholder="e.g. 4" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nut-grade">Grade</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="nut-grade" class="field-control">' +
              makeOptionsHtml(mod.lists.grade, "Select grade") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nut-machine">For machine</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<input id="nut-machine" type="text" class="field-control" placeholder="e.g. ROLLING MILL" />' +
          '</div>' +
        '</div>' +
      '</section>';

    const backBtn = document.getElementById("nut-back-btn");
    const nameBox = document.getElementById("nut-name-box");
    const charCounter = document.getElementById("nut-char-counter");
    const missingNote = document.getElementById("nut-missing-note");
    const rebuildBtn = document.getElementById("nut-rebuild-btn");
    const copyBtn = document.getElementById("nut-copy-btn");
    const longBox = document.getElementById("nut-long-box");
    const longRebuildBtn = document.getElementById("nut-long-rebuild-btn");
    const longCopyBtn = document.getElementById("nut-long-copy-btn");
    const drawingFrame = document.getElementById("nut-drawing-frame");
    const addExportBtn = document.getElementById("nut-add-export-btn");
    const exportFeedback = document.getElementById("nut-export-feedback");

    const inputs = {
      material: document.getElementById("nut-material"),
      type: document.getElementById("nut-type"),
      diameter: document.getElementById("nut-diameter"),
      pitch: document.getElementById("nut-pitch"),
      grade: document.getElementById("nut-grade"),
      machine: document.getElementById("nut-machine")
    };

    function readFieldValues() {
      return {
        material: inputs.material.value,
        type: inputs.type.value,
        diameter: inputs.diameter.value,
        pitch: inputs.pitch.value,
        grade: inputs.grade.value,
        machine: inputs.machine.value
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
        fields: {
          material: String(values.material || "").trim(),
          type: String(values.type || "").trim(),
          diameter: String(values.diameter || "").trim(),
          pitch: String(values.pitch || "").trim(),
          grade: String(values.grade || "").trim(),
          machine: String(values.machine || "").trim()
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
