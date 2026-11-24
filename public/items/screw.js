/* ----- SCREW MODULE ----- */
window.QS_MODULES.push({
  id: "screw",
  name: "Screw",
  searchWords: ["screw", "screws", "grub", "self tapping"],
  /* Easy-to-edit words that mean "not a screw" (sorted to Other in Existing materials) */
  notAScrewWords: ["PITCH GAUGE", "SCREWDRIVER", "SCREW DRIVER", "SCREW JACK"],
  tileBg: "#DCF7EC",
  tileColor: "#114639",
  iconSvg:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M5 7c0-2.2 3.1-4 7-4s7 1.8 7 4v1.5H5V7z"></path>' +
      '<path d="M12 3v3"></path>' +
      '<path d="M9.5 8.5v9.5L12 22l2.5-4V8.5"></path>' +
      '<path d="M9.5 12l5 1.5"></path>' +
      '<path d="M9.5 15.5l5 1.5"></path>' +
    '</svg>',

  /* SAP export defaults for Screw */
  exportDefaults: {
    materialType: "ERSA",
    baseUnit: "EA",
    materialGroup: "Mechanical"
  },

  /* Easy-to-edit Screw dropdown lists */
  lists: {
    material: ["MS", "SS", "GI", "HT", "COPPER"],
    type: ["ALLEN", "GRUB", "CSK", "PAN", "PH", "SD", "ST", "SP", "SET", "LOCKING"],
    diameter: ["M3", "M4", "M5", "M6", "M8", "M10", "M12"],
    thread: ["FULL THD", "HALF THD", "QTR THD"],
    grade: ["G8.8", "G10.9", "G12.9", "A2-70"]
  },

  /* Easy-to-edit material colors for the drawing */
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
      "ALLEN": "socket head screw (Allen key)",
      "GRUB": "grub screw (no head)",
      "CSK": "countersunk head screw",
      "PAN": "pan head screw",
      "PH": "Phillips head screw",
      "SD": "self drilling screw",
      "ST": "self tapping screw",
      "SP": "[CHECK: meaning of SP]",
      "SET": "set screw",
      "LOCKING": "locking screw"
    },
    thread: {
      "FULL THD": "fully threaded",
      "HALF THD": "half threaded",
      "QTR THD": "quarter threaded"
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
    const length = clean(values.length);
    const pitch = clean(values.pitch);
    const thread = clean(values.thread);
    const grade = clean(values.grade);
    const head = clean(values.head);
    const forText = clean(values.forText);

    const hasAnyField = Boolean(
      material || type || diameter || length || pitch || thread || grade || head || forText
    );
    if (!hasAnyField) {
      return "";
    }

    const size = [diameter, pitch, length].filter(Boolean).join("X");
    const forPart = forText ? ("FOR " + forText) : "";

    return [material, type, "SCREW", size, thread, grade, head, forPart]
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
    const lenVal = clean(values.length);
    const pitchVal = clean(values.pitch);
    const threadCode = upper(values.thread);
    const gradeCode = upper(values.grade);
    const headVal = clean(values.head);
    const forVal = clean(values.forText);

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

    if (lenVal) {
      parts.push("length " + lenVal + " mm");
    }

    const threadText = mod.meanings.thread[threadCode] || "";
    if (threadText) {
      parts.push(threadText);
    }

    const gradeText = mod.meanings.grade[gradeCode] || "";
    if (gradeText) {
      parts.push(gradeText);
    }

    const sentences = [];
    if (parts.length > 0) {
      const joined = parts.join(", ");
      sentences.push(joined.charAt(0).toUpperCase() + joined.slice(1) + ".");
    }

    if (headVal) {
      sentences.push("Head: " + headVal + ".");
    }

    if (forVal) {
      sentences.push("For: " + forVal + ".");
    }

    return sentences.join(" ");
  },

  /* Find which Required fields are still empty */
  getMissingRequired: function (values) {
    const missing = [];
    if (!String(values.type || "").trim()) missing.push("Type");
    if (!String(values.diameter || "").trim()) missing.push("Diameter");
    if (!String(values.length || "").trim()) missing.push("Length");
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
    const length = clean(values.length);
    const pitch = clean(values.pitch);
    const thread = upper(values.thread);
    const grade = upper(values.grade);
    const head = clean(values.head);
    const forText = clean(values.forText);

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
    const uid = "screw-g" + mod._svgUid + "-" + Math.random().toString(36).slice(2, 6);
    const gShank = uid + "-shank";
    const gHeadL = uid + "-hl";
    const gHeadC = uid + "-hc";
    const gHeadR = uid + "-hr";
    const gHeadV = uid + "-hv";
    const gSock = uid + "-sock";
    const gWash = uid + "-wash";

    const defsSvg =
      "<defs>" +
        '<linearGradient id="' + gShank + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="' + c3 + '" />' +
          '<stop offset="25%" stop-color="' + c1 + '" />' +
          '<stop offset="50%" stop-color="' + c2 + '" />' +
          '<stop offset="100%" stop-color="' + c3 + '" />' +
        "</linearGradient>" +
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
        '<linearGradient id="' + gSock + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="' + c3 + '" />' +
          '<stop offset="100%" stop-color="' + cs + '" />' +
        "</linearGradient>" +
        '<linearGradient id="' + gWash + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="' + c3 + '" />' +
          '<stop offset="30%" stop-color="' + c1 + '" />' +
          '<stop offset="100%" stop-color="' + c3 + '" />' +
        "</linearGradient>" +
      "</defs>";

    /* Top short-name lines */
    const topText = clean(shortNameText);
    const topLines = topText ? wrapLines(topText, 36) : ["NEW SCREW"];
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
    const dNum = (!isNaN(dParsed) && dParsed > 0) ? dParsed : 6;

    const lenParsed = parseFloat(length);
    const lenNum = (length && !isNaN(lenParsed) && lenParsed > 0) ? lenParsed : 30;

    let hdMult = 1.9;
    let kMult = 0.7;
    if (type === "ALLEN" || type === "LOCKING") {
      hdMult = 1.5;
      kMult = 1.0;
    } else if (type === "CSK") {
      hdMult = 2.0;
      kMult = 0.6;
    } else if (type === "SD") {
      hdMult = 1.7;
      kMult = 0.6;
    } else if (type === "GRUB" || type === "SET") {
      hdMult = 1.0;
      kMult = 0;
    }

    const Hd = hdMult * dNum;
    const k = kMult * dNum;
    const sc = Math.min(8, 200 / (k + lenNum), 110 / Hd);

    const shankW = dNum * sc;
    const halfW = shankW / 2;
    const shankLen = lenNum * sc;
    const headW = Hd * sc;
    const headH = k * sc;

    const PITCH_TABLE = { 3: 0.5, 4: 0.7, 5: 0.8, 6: 1, 8: 1.25, 10: 1.5, 12: 1.75 };
    const stdPitch = PITCH_TABLE[Math.round(dNum)] || Math.max(0.5, dNum * 0.145);
    const threadStep = Math.max(stdPitch * sc, 4);

    /* Geometry anchored around cx = 166 */
    const cx = 166;
    const xL = cx - halfW;
    const xR = cx + halfW;
    const yOffset = topShift;
    const chamfer = Math.max(1.8, Math.min(4.5, shankW * 0.14));

    const dimTopY = 58 + yOffset;
    let yShankTop = dimTopY + headH;
    let dimBotY = yShankTop + shankLen;
    let yTip = dimBotY - chamfer;
    let shapeSvg = "";
    let typeTargetX = cx + headW * 0.42;
    let typeTargetY = dimTopY + headH * 0.45;
    let headTargetX = cx + headW * 0.42;
    let headTargetY = dimTopY + headH * 0.78;
    let thTargetY = dimBotY - shankLen * 0.35;

    const tipShadow = function (yBottom) {
      return '<ellipse cx="' + cx + '" cy="' + f2(yBottom + 4.5) + '" rx="' + f2(Math.max(5, halfW * 0.9)) + '" ry="3" fill="#0F172A" opacity="0.12" />';
    };

    const shankHighlight = function (y1, y2) {
      if (y2 - y1 < 6) return "";
      const hxLine = f2(xL + Math.max(1.6, shankW * 0.22));
      const sw = Math.max(0.9, Math.min(1.8, shankW * 0.06));
      return '<line x1="' + hxLine + '" y1="' + f2(y1) + '" x2="' + hxLine + '" y2="' + f2(y2) + '" stroke="#FFFFFF" stroke-width="' + f2(sw) + '" stroke-linecap="round" opacity="0.5" />';
    };

    const drawCurvedThreads = function (yStart, yEnd, sharp) {
      if (!thread) return "";
      const yMin = Math.min(yStart, yEnd);
      const yMax = Math.max(yStart, yEnd);
      if (yMax - yMin < 2) return "";
      const dip = Math.max(1.4, Math.min(3.0, shankW * 0.08));
      const slope = Math.max(0.8, Math.min(2.2, threadStep * 0.3));
      const x1 = f2(xL + 0.7);
      const x2 = f2(xR - 0.7);
      const parts = [];
      for (let y = yMin; y <= yMax - 1; y += threadStep) {
        const ya = f2(y);
        const yb = f2(y + slope);
        const yCtrl = f2((ya + yb) * 0.5 + dip);
        const dMain = "M " + x1 + " " + ya + " Q " + cx + " " + yCtrl + " " + x2 + " " + yb;
        const dSub = "M " + x1 + " " + f2(ya + 1.1) + " Q " + cx + " " + f2(yCtrl + 1.1) + " " + x2 + " " + f2(yb + 1.1);
        parts.push(
          '<path d="' + dMain + '" fill="none" stroke="' + c3 + '" stroke-width="1.6" stroke-linecap="round" opacity="0.8" />' +
          '<path d="' + dSub + '" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.45" />'
        );
        if (sharp) {
          parts.push(
            '<polygon points="' + f2(xL) + "," + f2(ya - 1.5) + " " + f2(xL - 2.6) + "," + f2(ya + 0.4) + " " + f2(xL) + "," + f2(ya + 2.3) + '" fill="' + c2 + '" stroke="' + cs + '" stroke-width="0.8" />' +
            '<polygon points="' + f2(xR) + "," + f2(yb - 1.4) + " " + f2(xR + 2.6) + "," + f2(yb + 0.5) + " " + f2(xR) + "," + f2(yb + 2.4) + '" fill="' + c2 + '" stroke="' + cs + '" stroke-width="0.8" />'
          );
        }
      }
      return parts.join("");
    };

    const getThreadSpanFromTip = function (yBaseTop, yBaseEnd) {
      if (!thread) return null;
      const avail = Math.max(0, yBaseEnd - yBaseTop);
      if (thread === "FULL THD") return { y1: yBaseTop + 2, y2: yBaseEnd - 1 };
      if (thread === "QTR THD") return { y1: yBaseEnd - avail * 0.25, y2: yBaseEnd - 1 };
      return { y1: yBaseEnd - avail * 0.5, y2: yBaseEnd - 1 };
    };

    const drawFlatShank = function (yTop, yBottom) {
      const yB = yBottom - chamfer;
      return (
        tipShadow(yBottom) +
        '<path d="M ' + f2(xL) + " " + f2(yTop) + " H " + f2(xR) + " V " + f2(yB) + " L " + f2(xR - chamfer) + " " + f2(yBottom) + " H " + f2(xL + chamfer) + " L " + f2(xL) + " " + f2(yB) + ' Z" fill="url(#' + gShank + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />' +
        shankHighlight(yTop + 3, yB - 3)
      );
    };

    const drawPointedShank = function (yTop, yBottom, drillFlute) {
      const coneH = Math.min(Math.max(7, (yBottom - yTop) * 0.3), Math.max(8, shankW * 0.72));
      const yConeStart = yBottom - coneH;
      let extra = "";
      if (drillFlute) {
        extra =
          '<line x1="' + f2(cx - shankW * 0.16) + '" y1="' + f2(yConeStart + 1) + '" x2="' + f2(cx + 1) + '" y2="' + f2(yBottom - 3) + '" stroke="' + cs + '" stroke-width="1.15" />' +
          '<line x1="' + f2(cx + shankW * 0.2) + '" y1="' + f2(yConeStart + 2.5) + '" x2="' + cx + '" y2="' + f2(yBottom - 3) + '" stroke="' + cs + '" stroke-width="1.15" />';
      }
      return {
        yConeStart: yConeStart,
        svg:
          tipShadow(yBottom) +
          '<path d="M ' + f2(xL) + " " + f2(yTop) + " H " + f2(xR) + " V " + f2(yConeStart) + " L " + cx + " " + f2(yBottom) + " L " + f2(xL) + " " + f2(yConeStart) + ' Z" fill="url(#' + gShank + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />' +
          shankHighlight(yTop + 3, yConeStart - 3) +
          extra
      };
    };

    const drawHexHeadBlock = function (yHTop, yHBot, wPx) {
      const hL = cx - wPx / 2;
      const hR = cx + wPx / 2;
      const fW = wPx / 4;
      const hRound = Math.max(1.8, Math.min(4, (yHBot - yHTop) * 0.16));
      return (
        '<path d="M ' + f2(hL) + " " + f2(yHBot) + " V " + f2(yHTop + hRound) + " Q " + f2(hL) + " " + f2(yHTop) + " " + f2(hL + fW) + " " + f2(yHTop) + " V " + f2(yHBot) + ' Z" fill="url(#' + gHeadL + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />' +
        '<path d="M ' + f2(hL + fW) + " " + f2(yHBot) + " V " + f2(yHTop) + " Q " + cx + " " + f2(yHTop - hRound * 0.6) + " " + f2(hR - fW) + " " + f2(yHTop) + " V " + f2(yHBot) + ' Z" fill="url(#' + gHeadC + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />' +
        '<path d="M ' + f2(hR - fW) + " " + f2(yHBot) + " V " + f2(yHTop) + " Q " + f2(hR) + " " + f2(yHTop) + " " + f2(hR) + " " + f2(yHTop + hRound) + " V " + f2(yHBot) + ' Z" fill="url(#' + gHeadR + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />'
      );
    };

    if (type === "ALLEN") {
      const yHeadBot = dimTopY + headH;
      yShankTop = yHeadBot;
      dimBotY = yShankTop + shankLen;
      yTip = dimBotY - chamfer;
      const span = getThreadSpanFromTip(yShankTop, yTip);
      thTargetY = span ? (span.y1 + span.y2) * 0.5 : (yShankTop + shankLen * 0.65);

      const aL = cx - headW / 2;
      const aR = cx + headW / 2;
      typeTargetX = aR;
      typeTargetY = (dimTopY + yHeadBot) * 0.45;
      headTargetX = aR;
      headTargetY = (dimTopY + yHeadBot) * 0.78;

      const sockW = Math.max(5, shankW * 0.55);
      const sockD = Math.max(4, headH * 0.48);
      const knurlInset = Math.max(2.5, headW * 0.09);

      shapeSvg =
        drawFlatShank(yHeadBot, dimBotY) +
        (span ? drawCurvedThreads(span.y1, span.y2, false) : "") +
        '<rect x="' + f2(aL) + '" y="' + f2(dimTopY) + '" width="' + f2(headW) + '" height="' + f2(headH) + '" rx="2.5" fill="url(#' + gShank + ')" stroke="' + cs + '" stroke-width="1.1" />' +
        '<line x1="' + f2(aL + knurlInset) + '" y1="' + f2(dimTopY + 3) + '" x2="' + f2(aL + knurlInset) + '" y2="' + f2(yHeadBot - 3) + '" stroke="' + c3 + '" stroke-width="0.9" opacity="0.7" />' +
        '<line x1="' + f2(aR - knurlInset) + '" y1="' + f2(dimTopY + 3) + '" x2="' + f2(aR - knurlInset) + '" y2="' + f2(yHeadBot - 3) + '" stroke="' + c3 + '" stroke-width="0.9" opacity="0.7" />' +
        '<path d="M ' + f2(cx - sockW / 2) + " " + f2(dimTopY) + " v " + f2(sockD) + " l " + f2(sockW / 2) + " " + f2(Math.max(2, sockD * 0.25)) + " l " + f2(sockW / 2) + " " + f2(-Math.max(2, sockD * 0.25)) + " v " + f2(-sockD) + '" fill="' + c3 + '" stroke="' + cs + '" stroke-width="0.9" stroke-dasharray="3 2" opacity="0.55" />';
    } else if (type === "GRUB") {
      yShankTop = dimTopY;
      dimBotY = dimTopY + shankLen;
      yTip = dimBotY - chamfer;
      const yTop = dimTopY + chamfer;
      const span = getThreadSpanFromTip(yTop, yTip);
      thTargetY = span ? (span.y1 + span.y2) * 0.5 : (dimTopY + shankLen * 0.6);

      typeTargetX = xR;
      typeTargetY = dimTopY + Math.min(12, shankLen * 0.2);
      headTargetX = xR;
      headTargetY = dimTopY + Math.min(20, shankLen * 0.35);

      const sockW = Math.max(4.5, shankW * 0.52);
      const sockD = Math.min(shankLen * 0.35, Math.max(5, shankW * 0.48));
      shapeSvg =
        tipShadow(dimBotY) +
        '<path d="M ' + f2(xL + chamfer) + " " + f2(dimTopY) + " H " + f2(xR - chamfer) + " L " + f2(xR) + " " + f2(yTop) + " V " + f2(yTip) + " L " + f2(xR - chamfer) + " " + f2(dimBotY) + " H " + f2(xL + chamfer) + " L " + f2(xL) + " " + f2(yTip) + " V " + f2(yTop) + ' Z" fill="url(#' + gShank + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />' +
        shankHighlight(yTop + 4, yTip - 3) +
        (span ? drawCurvedThreads(span.y1, span.y2, false) : "") +
        '<path d="M ' + f2(cx - sockW / 2) + " " + f2(dimTopY) + " v " + f2(sockD) + " l " + f2(sockW / 2) + " " + f2(Math.max(2, sockD * 0.25)) + " l " + f2(sockW / 2) + " " + f2(-Math.max(2, sockD * 0.25)) + " v " + f2(-sockD) + '" fill="' + c3 + '" stroke="' + cs + '" stroke-width="0.9" stroke-dasharray="3 2" opacity="0.6" />';
    } else if (type === "SET") {
      yShankTop = dimTopY;
      dimBotY = dimTopY + shankLen;
      yTip = dimBotY - chamfer;
      const yTop = dimTopY + chamfer;
      const span = getThreadSpanFromTip(yTop, yTip);
      thTargetY = span ? (span.y1 + span.y2) * 0.5 : (dimTopY + shankLen * 0.6);

      typeTargetX = xR;
      typeTargetY = dimTopY + Math.min(12, shankLen * 0.2);
      headTargetX = xR;
      headTargetY = dimTopY + Math.min(20, shankLen * 0.35);

      const slotW = Math.max(3, shankW * 0.24);
      const slotD = Math.min(shankLen * 0.3, Math.max(4, shankW * 0.34));
      shapeSvg =
        tipShadow(dimBotY) +
        '<path d="M ' + f2(xL + chamfer) + " " + f2(dimTopY) + " H " + f2(xR - chamfer) + " L " + f2(xR) + " " + f2(yTop) + " V " + f2(yTip) + " L " + f2(xR - chamfer) + " " + f2(dimBotY) + " H " + f2(xL + chamfer) + " L " + f2(xL) + " " + f2(yTip) + " V " + f2(yTop) + ' Z" fill="url(#' + gShank + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />' +
        shankHighlight(yTop + 4, yTip - 3) +
        (span ? drawCurvedThreads(span.y1, span.y2, false) : "") +
        '<rect x="' + f2(cx - slotW / 2) + '" y="' + f2(dimTopY) + '" width="' + f2(slotW) + '" height="' + f2(slotD) + '" fill="' + c3 + '" stroke="' + cs + '" stroke-width="0.9" />';
    } else if (type === "CSK") {
      const yHeadBot = dimTopY + headH;
      yShankTop = yHeadBot;
      dimBotY = yShankTop + shankLen;
      yTip = dimBotY - chamfer;
      const span = getThreadSpanFromTip(yShankTop, yTip);
      thTargetY = span ? (span.y1 + span.y2) * 0.5 : (yShankTop + shankLen * 0.65);

      const hL = cx - headW / 2;
      const hR = cx + headW / 2;
      typeTargetX = hR - (headW - shankW) * 0.12;
      typeTargetY = dimTopY + headH * 0.3;
      headTargetX = xR + (headW - shankW) * 0.2;
      headTargetY = dimTopY + headH * 0.72;

      const slotW = Math.max(3, shankW * 0.22);
      const slotD = Math.max(3.5, headH * 0.36);

      shapeSvg =
        drawFlatShank(yHeadBot, dimBotY) +
        (span ? drawCurvedThreads(span.y1, span.y2, false) : "") +
        '<path d="M ' + f2(hL) + " " + f2(dimTopY + 1) + " Q " + cx + " " + f2(dimTopY - 1.5) + " " + f2(hR) + " " + f2(dimTopY + 1) + " L " + f2(xR) + " " + f2(yHeadBot) + " H " + f2(xL) + ' Z" fill="url(#' + gHeadC + ')" stroke="' + cs + '" stroke-width="1.1" stroke-linejoin="round" />' +
        '<rect x="' + f2(cx - slotW / 2) + '" y="' + f2(dimTopY) + '" width="' + f2(slotW) + '" height="' + f2(slotD) + '" fill="' + c3 + '" stroke="' + cs + '" stroke-width="0.9" />';
    } else if (type === "SD") {
      const yHeadBot = dimTopY + headH;
      const washH = Math.max(3, headH * 0.28);
      const yHexBot = yHeadBot - washH;
      yShankTop = yHeadBot;
      dimBotY = yShankTop + shankLen;
      const pointed = drawPointedShank(yHeadBot, dimBotY, true);
      const span = getThreadSpanFromTip(yShankTop, pointed.yConeStart);
      thTargetY = span ? (span.y1 + span.y2) * 0.5 : (yShankTop + shankLen * 0.55);

      const washW = Math.min(114, headW * 1.16);
      typeTargetX = cx + headW / 2;
      typeTargetY = (dimTopY + yHexBot) * 0.5;
      headTargetX = cx + washW / 2;
      headTargetY = (yHexBot + yHeadBot) * 0.5;

      shapeSvg =
        pointed.svg +
        (span ? drawCurvedThreads(span.y1, span.y2, false) : "") +
        drawHexHeadBlock(dimTopY, yHexBot, headW) +
        '<rect x="' + f2(cx - washW / 2) + '" y="' + f2(yHexBot) + '" width="' + f2(washW) + '" height="' + f2(washH) + '" rx="1.5" fill="url(#' + gWash + ')" stroke="' + cs + '" stroke-width="0.95" />';
    } else if (type === "LOCKING") {
      const yHeadBot = dimTopY + headH;
      const ringH = Math.max(3, headH * 0.26);
      const yHexBot = yHeadBot - ringH;
      yShankTop = yHeadBot;
      dimBotY = yShankTop + shankLen;
      yTip = dimBotY - chamfer;
      const span = getThreadSpanFromTip(yShankTop, yTip);
      thTargetY = span ? (span.y1 + span.y2) * 0.5 : (yShankTop + shankLen * 0.65);

      const ringW = Math.min(114, headW * 1.12);
      typeTargetX = cx + headW / 2;
      typeTargetY = (dimTopY + yHexBot) * 0.5;
      headTargetX = cx + ringW / 2;
      headTargetY = (yHexBot + yHeadBot) * 0.5;

      shapeSvg =
        drawFlatShank(yHeadBot, dimBotY) +
        (span ? drawCurvedThreads(span.y1, span.y2, false) : "") +
        drawHexHeadBlock(dimTopY, yHexBot, headW) +
        '<rect x="' + f2(cx - ringW / 2) + '" y="' + f2(yHexBot) + '" width="' + f2(ringW) + '" height="' + f2(ringH) + '" rx="1.5" fill="url(#' + gWash + ')" stroke="' + cs + '" stroke-width="0.95" />' +
        '<line x1="' + f2(cx - ringW * 0.3) + '" y1="' + f2(yHexBot) + '" x2="' + f2(cx - ringW * 0.3) + '" y2="' + f2(yHeadBot) + '" stroke="' + cs + '" stroke-width="0.9" />' +
        '<line x1="' + cx + '" y1="' + f2(yHexBot) + '" x2="' + cx + '" y2="' + f2(yHeadBot) + '" stroke="' + cs + '" stroke-width="1" />' +
        '<line x1="' + f2(cx + ringW * 0.3) + '" y1="' + f2(yHexBot) + '" x2="' + f2(cx + ringW * 0.3) + '" y2="' + f2(yHeadBot) + '" stroke="' + cs + '" stroke-width="0.9" />';
    } else if (type === "PH") {
      const yHeadBot = dimTopY + headH;
      yShankTop = yHeadBot;
      dimBotY = yShankTop + shankLen;
      yTip = dimBotY - chamfer;
      const span = getThreadSpanFromTip(yShankTop, yTip);
      thTargetY = span ? (span.y1 + span.y2) * 0.5 : (yShankTop + shankLen * 0.65);

      const hL = cx - headW / 2;
      const hR = cx + headW / 2;
      typeTargetX = hR;
      typeTargetY = dimTopY + headH * 0.5;
      headTargetX = hR;
      headTargetY = yHeadBot - 3;

      const crossR = Math.max(3, Math.min(7, headH * 0.3));
      const crossCy = dimTopY + headH * 0.5;

      shapeSvg =
        drawFlatShank(yHeadBot, dimBotY) +
        (span ? drawCurvedThreads(span.y1, span.y2, false) : "") +
        '<path d="M ' + f2(hL) + " " + f2(yHeadBot) + " C " + f2(hL) + " " + f2(dimTopY - headH * 0.2) + ", " + f2(hR) + " " + f2(dimTopY - headH * 0.2) + ", " + f2(hR) + " " + f2(yHeadBot) + ' Z" fill="url(#' + gHeadC + ')" stroke="' + cs + '" stroke-width="1.1" stroke-linejoin="round" />' +
        '<path d="M ' + cx + " " + f2(crossCy - crossR) + " v " + f2(crossR * 2) + " M " + f2(cx - crossR) + " " + f2(crossCy) + " h " + f2(crossR * 2) + '" stroke="' + cs + '" stroke-width="1.6" stroke-linecap="round" />';
    } else if (type === "ST" || type === "SP") {
      const yHeadBot = dimTopY + headH;
      yShankTop = yHeadBot;
      dimBotY = yShankTop + shankLen;
      const pointed = drawPointedShank(yHeadBot, dimBotY, false);
      const span = getThreadSpanFromTip(yShankTop + 1, pointed.yConeStart);
      thTargetY = span ? (span.y1 + span.y2) * 0.5 : (yShankTop + shankLen * 0.55);

      const hL = cx - headW / 2;
      const hR = cx + headW / 2;
      const rCorner = Math.min(headW * 0.25, headH * 0.55);
      typeTargetX = hR;
      typeTargetY = dimTopY + headH * 0.45;
      headTargetX = hR;
      headTargetY = yHeadBot - 3;

      const slotW = Math.max(3, shankW * 0.22);
      const slotD = Math.max(3.5, headH * 0.36);

      shapeSvg =
        pointed.svg +
        (span ? drawCurvedThreads(span.y1, span.y2, type === "ST") : "") +
        '<path d="M ' + f2(hL) + " " + f2(yHeadBot) + " V " + f2(dimTopY + rCorner) + " Q " + f2(hL) + " " + f2(dimTopY) + " " + f2(hL + rCorner) + " " + f2(dimTopY) + " H " + f2(hR - rCorner) + " Q " + f2(hR) + " " + f2(dimTopY) + " " + f2(hR) + " " + f2(dimTopY + rCorner) + " V " + f2(yHeadBot) + ' Z" fill="url(#' + gHeadC + ')" stroke="' + cs + '" stroke-width="1.1" stroke-linejoin="round" />' +
        (type === "ST"
          ? '<rect x="' + f2(cx - slotW / 2) + '" y="' + f2(dimTopY) + '" width="' + f2(slotW) + '" height="' + f2(slotD) + '" fill="' + c3 + '" stroke="' + cs + '" stroke-width="0.9" />'
          : '<line x1="' + cx + '" y1="' + f2(dimTopY) + '" x2="' + cx + '" y2="' + f2(dimTopY + slotD) + '" stroke="' + cs + '" stroke-width="1.6" />');
    } else {
      /* PAN or No Type chosen yet */
      const yHeadBot = dimTopY + headH;
      yShankTop = yHeadBot;
      dimBotY = yShankTop + shankLen;
      yTip = dimBotY - chamfer;
      const span = getThreadSpanFromTip(yShankTop, yTip);
      thTargetY = span ? (span.y1 + span.y2) * 0.5 : (yShankTop + shankLen * 0.65);

      const hL = cx - headW / 2;
      const hR = cx + headW / 2;
      const rCorner = Math.min(headW * 0.25, headH * 0.55);
      typeTargetX = hR;
      typeTargetY = dimTopY + headH * 0.45;
      headTargetX = hR;
      headTargetY = yHeadBot - 3;

      const slotW = Math.max(3, shankW * 0.22);
      const slotD = Math.max(3.5, headH * 0.36);

      shapeSvg =
        drawFlatShank(yHeadBot, dimBotY) +
        (span ? drawCurvedThreads(span.y1, span.y2, false) : "") +
        '<path d="M ' + f2(hL) + " " + f2(yHeadBot) + " V " + f2(dimTopY + rCorner) + " Q " + f2(hL) + " " + f2(dimTopY) + " " + f2(hL + rCorner) + " " + f2(dimTopY) + " H " + f2(hR - rCorner) + " Q " + f2(hR) + " " + f2(dimTopY) + " " + f2(hR) + " " + f2(dimTopY + rCorner) + " V " + f2(yHeadBot) + ' Z" fill="url(#' + gHeadC + ')" stroke="' + cs + '" stroke-width="1.1" stroke-linejoin="round" />' +
        '<rect x="' + f2(cx - slotW / 2) + '" y="' + f2(dimTopY) + '" width="' + f2(slotW) + '" height="' + f2(slotD) + '" fill="' + c3 + '" stroke="' + cs + '" stroke-width="0.9" />';
    }

    /* Head view (right side, radius = Hd * sc / 2 clamped 12..32) */
    const hx = 304;
    const hvRadius = Math.max(12, Math.min(32, headW / 2));
    const hy = Math.round(210 + hvRadius + yOffset);
    const hvLabelY = hy - hvRadius - 12;

    let headShapeSvg = "";
    let showGradeOnHead = false;
    let gradeTextColor = (material === "HT") ? "#F8FAFC" : cs;

    if (!type) {
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius) + '" fill="url(#' + gHeadV + ')" stroke="' + cs + '" stroke-width="1.15" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius * 0.78) + '" fill="none" stroke="' + cs + '" stroke-width="0.9" opacity="0.55" />';
      showGradeOnHead = hvRadius >= 15;
    } else if (type === "LOCKING" || type === "SD") {
      headShapeSvg =
        '<polygon points="' + hexPoints(hx, hy, hvRadius) + '" fill="url(#' + gHeadV + ')" stroke="' + cs + '" stroke-width="1.15" stroke-linejoin="round" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius * 0.72) + '" fill="none" stroke="' + cs + '" stroke-width="0.9" opacity="0.55" />';
      showGradeOnHead = hvRadius >= 15;
    } else if (type === "ALLEN") {
      const sockR = Math.max(4.5, hvRadius * 0.44);
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius) + '" fill="url(#' + gHeadV + ')" stroke="' + cs + '" stroke-width="1.15" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius * 0.8) + '" fill="none" stroke="' + cs + '" stroke-width="0.9" opacity="0.5" />' +
        '<polygon points="' + hexPoints(hx, hy, sockR) + '" fill="url(#' + gSock + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />';
      showGradeOnHead = hvRadius >= 16;
      gradeTextColor = "#FFFFFF";
    } else if (type === "PH") {
      const arm = f2(hvRadius * 0.56);
      const t = f2(Math.max(2, hvRadius * 0.13));
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius) + '" fill="url(#' + gHeadV + ')" stroke="' + cs + '" stroke-width="1.15" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius * 0.8) + '" fill="none" stroke="' + cs + '" stroke-width="0.9" opacity="0.5" />' +
        '<path d="M ' + f2(hx - t) + " " + f2(hy - arm) + " h " + f2(t * 2) + " v " + f2(arm - t) + " h " + f2(arm - t) + " v " + f2(t * 2) + " h " + f2(-(arm - t)) + " v " + f2(arm - t) + " h " + f2(-t * 2) + " v " + f2(-(arm - t)) + " h " + f2(-(arm - t)) + " v " + f2(-t * 2) + " h " + f2(arm - t) + ' Z" fill="url(#' + gSock + ')" stroke="' + cs + '" stroke-width="0.9" stroke-linejoin="round" />';
      showGradeOnHead = hvRadius >= 18;
      gradeTextColor = "#FFFFFF";
    } else if (type === "GRUB") {
      const sockR = Math.max(4, hvRadius * 0.5);
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius * 1.15) + '" fill="none" stroke="' + c3 + '" stroke-width="1" stroke-dasharray="3 2" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius) + '" fill="url(#' + gHeadV + ')" stroke="' + cs + '" stroke-width="1.15" />' +
        '<polygon points="' + hexPoints(hx, hy, sockR) + '" fill="url(#' + gSock + ')" stroke="' + cs + '" stroke-width="1" stroke-linejoin="round" />';
      showGradeOnHead = hvRadius >= 18;
      gradeTextColor = "#FFFFFF";
    } else if (type === "SET") {
      const slotW = f2(hvRadius * 1.56);
      const slotH = f2(Math.max(3, hvRadius * 0.24));
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius * 1.15) + '" fill="none" stroke="' + c3 + '" stroke-width="1" stroke-dasharray="3 2" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius) + '" fill="url(#' + gHeadV + ')" stroke="' + cs + '" stroke-width="1.15" />' +
        '<rect x="' + f2(hx - slotW / 2) + '" y="' + f2(hy - slotH / 2) + '" width="' + slotW + '" height="' + slotH + '" rx="1" fill="url(#' + gSock + ')" stroke="' + cs + '" stroke-width="0.9" />';
      showGradeOnHead = hvRadius >= 18;
      gradeTextColor = "#FFFFFF";
    } else {
      /* CSK, PAN, ST, SP: round head with slot */
      const slotW = f2(hvRadius * 1.6);
      const slotH = f2(Math.max(3, hvRadius * 0.22));
      headShapeSvg =
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius) + '" fill="url(#' + gHeadV + ')" stroke="' + cs + '" stroke-width="1.15" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="' + f2(hvRadius * 0.8) + '" fill="none" stroke="' + cs + '" stroke-width="0.9" opacity="0.5" />' +
        '<rect x="' + f2(hx - slotW / 2) + '" y="' + f2(hy - slotH / 2) + '" width="' + slotW + '" height="' + slotH + '" rx="1" fill="url(#' + gSock + ')" stroke="' + cs + '" stroke-width="0.9" />';
      showGradeOnHead = hvRadius >= 16;
      gradeTextColor = "#FFFFFF";
    }

    const gradeTextClean = grade ? (grade.charAt(0) === "G" ? grade.slice(1) : grade) : "";
    let headGradeSvg = "";
    if (gradeTextClean && showGradeOnHead) {
      const gFs = gradeTextClean.length > 4 ? Math.max(7.2, Math.min(10, hvRadius * 0.40)) : Math.max(8, Math.min(11, hvRadius * 0.48));
      headGradeSvg =
        '<text x="' + hx + '" y="' + f2(hy + gFs * 0.34) + '" text-anchor="middle" font-size="' + f2(gFs) + '" font-weight="800" fill="' + gradeTextColor + '" stroke="' + cs + '" stroke-width="0.6" paint-order="stroke">' +
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

    const xLenArrow = 104;
    const xLeftText = 98;
    const yLenMid = Math.round((dimTopY + dimBotY) / 2);

    const availShank = Math.max(12, dimBotY - yShankTop);
    let yDia = yShankTop + Math.min(34, Math.max(9, availShank * 0.3));
    if (Math.abs(yDia - yLenMid) < 18 && yShankTop + 10 <= yLenMid - 18) {
      yDia = yLenMid - 18;
    }

    const diaLabel = diameter ? ("Diameter: " + diameter) : "Diameter: ?";
    const diaColor = diameter ? reqColor : missingColor;
    const diaSvg =
      '<line x1="' + (xLeftText + 4) + '" y1="' + f2(yDia) + '" x2="' + f2(xR) + '" y2="' + f2(yDia) + '" stroke="' + diaColor + '" stroke-width="1" />' +
      '<polygon points="' + f2(xL) + "," + f2(yDia) + " " + f2(xL - 5) + "," + f2(yDia - 3) + " " + f2(xL - 5) + "," + f2(yDia + 3) + '" fill="' + diaColor + '" />' +
      '<polygon points="' + f2(xR) + "," + f2(yDia) + " " + f2(xR + 5) + "," + f2(yDia - 3) + " " + f2(xR + 5) + "," + f2(yDia + 3) + '" fill="' + diaColor + '" />' +
      '<text x="' + xLeftText + '" y="' + f2(yDia - 3) + '" text-anchor="end" font-size="11.5" font-weight="700" fill="' + diaColor + '">' + esc(diaLabel) + "</text>";

    const lenLabel = length ? ("Length: " + length + " mm") : "Length: ?";
    const lenColor = length ? reqColor : missingColor;
    let yLenText = yLenMid + 4;
    if (Math.abs(yLenText - (yDia - 3)) < 16) {
      yLenText = yDia + 15;
    }
    const lenSvg =
      '<line x1="' + xLenArrow + '" y1="' + f2(dimTopY) + '" x2="' + f2(xL - 4) + '" y2="' + f2(dimTopY) + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
      '<line x1="' + xLenArrow + '" y1="' + f2(dimBotY) + '" x2="' + f2(xL - 4) + '" y2="' + f2(dimBotY) + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
      '<line x1="' + xLenArrow + '" y1="' + f2(dimTopY + 3) + '" x2="' + xLenArrow + '" y2="' + f2(dimBotY - 3) + '" stroke="' + lenColor + '" stroke-width="1" />' +
      '<polygon points="' + xLenArrow + "," + f2(dimTopY) + " " + (xLenArrow - 3) + "," + f2(dimTopY + 6) + " " + (xLenArrow + 3) + "," + f2(dimTopY + 6) + '" fill="' + lenColor + '" />' +
      '<polygon points="' + xLenArrow + "," + f2(dimBotY) + " " + (xLenArrow - 3) + "," + f2(dimBotY - 6) + " " + (xLenArrow + 3) + "," + f2(dimBotY - 6) + '" fill="' + lenColor + '" />' +
      '<text x="' + xLeftText + '" y="' + f2(yLenText) + '" text-anchor="end" font-size="11.5" font-weight="700" fill="' + lenColor + '">' + esc(lenLabel) + "</text>";

    let pitchSvg = "";
    if (pitch) {
      const yPitchTarget = Math.min(dimBotY - 4, yShankTop + availShank * 0.72);
      const yPitchLabel = Math.max(yLenText + 16, yDia + 18, yPitchTarget + 4);
      const yPitchLine = yPitchLabel - 4;
      pitchSvg =
        '<polyline points="' + (xLeftText + 4) + "," + f2(yPitchLine) + " " + (xLeftText + 10) + "," + f2(yPitchLine) + " " + f2(xL - 1) + "," + f2(yPitchTarget) + '" fill="none" stroke="' + optColor + '" stroke-width="1" />' +
        '<circle cx="' + f2(xL - 1) + '" cy="' + f2(yPitchTarget) + '" r="2" fill="' + optColor + '" />' +
        '<text x="' + xLeftText + '" y="' + f2(yPitchLabel) + '" text-anchor="end" font-size="11.5" font-weight="700" fill="' + optColor + '">Pitch: ' + esc(pitch) + "</text>";
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
    const typeSvg = rightPointer(62 + yOffset, typeTargetY, typeTargetX, typeLabel, type ? reqColor : missingColor);

    let headSvg = "";
    if (head) {
      headSvg = rightPointer(86 + yOffset, headTargetY, headTargetX, "Head: " + head, optColor);
    }

    let materialSvg = "";
    if (material) {
      const yMat = 110 + yOffset;
      const matText = "Material: " + material;
      const matFs = matText.length > 14 ? "11" : "11.5";
      const matTargetY = Math.min(dimBotY - 6, yShankTop + 12);
      materialSvg =
        '<polyline points="' + f2(xR) + "," + f2(matTargetY) + " " + (xLabelCol - 10) + "," + yMat + " " + (xLabelCol - 4) + "," + yMat + '" fill="none" stroke="' + optColor + '" stroke-width="1" />' +
        '<circle cx="' + f2(xR) + '" cy="' + f2(matTargetY) + '" r="2" fill="' + optColor + '" />' +
        '<circle cx="' + (xLabelCol + 4) + '" cy="' + yMat + '" r="5" fill="' + c2 + '" stroke="' + cs + '" stroke-width="1" />' +
        '<text x="' + (xLabelCol + 13) + '" y="' + (yMat + 4) + '" text-anchor="start" font-size="' + matFs + '" font-weight="700" fill="' + optColor + '">' + esc(matText) + "</text>";
    }

    let gradeSvg = "";
    if (grade) {
      const gTargetY = Math.min(dimBotY - 6, yShankTop + Math.max(10, shankLen * 0.25));
      gradeSvg = rightPointer(134 + yOffset, gTargetY, xR, "Grade: " + grade, optColor);
    }

    let threadSvg = "";
    if (thread) {
      threadSvg = rightPointer(158 + yOffset, thTargetY, xR, "Thread: " + thread, optColor);
    }

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
    const yScale = Math.max(dimBotY + 22, hy + hvRadius + 24);
    const xScale1 = f2(cx - scalePx / 2);
    const xScale2 = f2(cx + scalePx / 2);
    const scaleBarSvg =
      '<g class="screw-scale-bar">' +
        '<line x1="' + xScale1 + '" y1="' + f2(yScale) + '" x2="' + xScale2 + '" y2="' + f2(yScale) + '" stroke="#476B62" stroke-width="1.4" />' +
        '<line x1="' + xScale1 + '" y1="' + f2(yScale - 4) + '" x2="' + xScale1 + '" y2="' + f2(yScale + 4) + '" stroke="#476B62" stroke-width="1.4" />' +
        '<line x1="' + xScale2 + '" y1="' + f2(yScale - 4) + '" x2="' + xScale2 + '" y2="' + f2(yScale + 4) + '" stroke="#476B62" stroke-width="1.4" />' +
        '<text x="' + cx + '" y="' + f2(yScale + 14) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#476B62">' + scaleMm + " mm</text>" +
      "</g>";

    /* Bottom: For (only if filled, wraps cleanly below scale bar) */
    let forSvg = "";
    let forHeight = 0;
    if (forText) {
      const forLines = wrapLines("For: " + forText, 40);
      forHeight = forLines.length * 16 + 8;
      forSvg = forLines.map(function (line, i) {
        const y = yScale + 34 + i * 16;
        return (
          '<text x="190" y="' + f2(y) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#0F3B33">' +
            esc(line) +
          "</text>"
        );
      }).join("");
    }

    const totalHeight = Math.round(yScale + 26 + forHeight);

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" shape-rendering="geometricPrecision" role="img" aria-label="Screw technical drawing">' +
        defsSvg +
        '<rect x="0" y="0" width="380" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        '<g class="bolt-shape-animate">' +
          shapeSvg +
        "</g>" +
        headViewSvg +
        diaSvg +
        lenSvg +
        pitchSvg +
        typeSvg +
        headSvg +
        materialSvg +
        gradeSvg +
        threadSvg +
        scaleBarSvg +
        forSvg +
      "</svg>"
    );
  },

  /* Draw the Screw screen */
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
        '<button type="button" class="back-btn" id="screw-back-btn" aria-label="Back to Rules">' +
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
            '<button type="button" class="btn-secondary" id="screw-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="screw-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="screw-name-box" class="name-textarea" rows="2" aria-label="SAP Short Text" autocapitalize="characters" spellcheck="false" placeholder="PICK FIELDS BELOW TO BUILD NAME..."></textarea>' +

        '<div class="name-meta-row">' +
          '<span id="screw-char-counter" class="char-counter">0 / 40</span>' +
          '<p id="screw-missing-note" class="missing-note"></p>' +
        '</div>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 2;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Long text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="screw-long-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="screw-long-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="screw-long-box" class="name-textarea long-textarea" rows="3" aria-label="Long text" placeholder="Pick fields below to build long text..."></textarea>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 3;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Drawing</h2>' +
        '</div>' +
        '<div id="screw-drawing-frame" class="drawing-frame"></div>' +
      '</section>' +

      '<section class="card add-export-card card-stagger" style="--card-index: 4;">' +
        '<button type="button" class="btn-primary add-export-btn" id="screw-add-export-btn">Add to export list</button>' +
        '<p id="screw-export-feedback" class="add-export-feedback is-hidden" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card card-stagger" style="--card-index: 5;">' +
        '<div class="fields-grid">' +
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-material">Material</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="screw-material" class="field-control">' +
              makeOptionsHtml(mod.lists.material, "Select material") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-type">Type</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="screw-type" class="field-control">' +
              makeOptionsHtml(mod.lists.type, "Select type") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-diameter">Diameter</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="screw-diameter" class="field-control">' +
              makeOptionsHtml(mod.lists.diameter, "Select diameter") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-length">Length in mm</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<input id="screw-length" type="number" inputmode="decimal" min="1" step="any" class="field-control" placeholder="e.g. 30" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-pitch">Pitch</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<input id="screw-pitch" type="text" inputmode="decimal" class="field-control" placeholder="e.g. 1.25" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-thread">Thread</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="screw-thread" class="field-control">' +
              makeOptionsHtml(mod.lists.thread, "Select thread") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-grade">Grade</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="screw-grade" class="field-control">' +
              makeOptionsHtml(mod.lists.grade, "Select grade") +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-head">Head</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<input id="screw-head" type="number" inputmode="decimal" min="0" step="any" class="field-control" placeholder="e.g. 5" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="screw-for">For</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<input id="screw-for" type="text" class="field-control" placeholder="e.g. GUIDEBOX" />' +
          '</div>' +
        '</div>' +
      '</section>';

    const backBtn = document.getElementById("screw-back-btn");
    const nameBox = document.getElementById("screw-name-box");
    const charCounter = document.getElementById("screw-char-counter");
    const missingNote = document.getElementById("screw-missing-note");
    const rebuildBtn = document.getElementById("screw-rebuild-btn");
    const copyBtn = document.getElementById("screw-copy-btn");
    const longBox = document.getElementById("screw-long-box");
    const longRebuildBtn = document.getElementById("screw-long-rebuild-btn");
    const longCopyBtn = document.getElementById("screw-long-copy-btn");
    const drawingFrame = document.getElementById("screw-drawing-frame");
    const addExportBtn = document.getElementById("screw-add-export-btn");
    const exportFeedback = document.getElementById("screw-export-feedback");

    const inputs = {
      material: document.getElementById("screw-material"),
      type: document.getElementById("screw-type"),
      diameter: document.getElementById("screw-diameter"),
      length: document.getElementById("screw-length"),
      pitch: document.getElementById("screw-pitch"),
      thread: document.getElementById("screw-thread"),
      grade: document.getElementById("screw-grade"),
      head: document.getElementById("screw-head"),
      forText: document.getElementById("screw-for")
    };

    function readFieldValues() {
      return {
        material: inputs.material.value,
        type: inputs.type.value,
        diameter: inputs.diameter.value,
        length: inputs.length.value,
        pitch: inputs.pitch.value,
        thread: inputs.thread.value,
        grade: inputs.grade.value,
        head: inputs.head.value,
        forText: inputs.forText.value
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
          length: String(values.length || "").trim(),
          pitch: String(values.pitch || "").trim(),
          thread: String(values.thread || "").trim(),
          grade: String(values.grade || "").trim(),
          head: String(values.head || "").trim(),
          forText: String(values.forText || "").trim()
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
