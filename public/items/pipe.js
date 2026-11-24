/* ----- PIPE MODULE ----- */
window.QS_MODULES.push({
  id: "pipe",
  name: "Pipe",
  searchWords: ["PIPES", "SEAMLESS PIPE", "SQUARE PIPE"],
  notAScrewWords: [
    "WRENCH", "CLAMP", "NIPPLE", "ELBOW", "TEE", "FLANGE", "REDUCER",
    "CUTTER", "HOSE", "UNION", "COUPLING", "VALVE", "FITTING", "HANGER",
    "SUPPORT", "BRACKET", "CLIP", "TORCH", "FILTER", "STRAINER", "GASKET"
  ],
  tileBg: "#CBEFE3",
  tileColor: "#0D3A2F",
  iconSvg:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<ellipse cx="6.5" cy="12" rx="2.5" ry="5.5"></ellipse>' +
      '<ellipse cx="6.5" cy="12" rx="1" ry="2.4"></ellipse>' +
      '<path d="M6.5 6.5h11c1.38 0 2.5 2.46 2.5 5.5s-1.12 5.5-2.5 5.5h-11"></path>' +
    '</svg>',

  /* SAP export defaults for Pipe */
  exportDefaults: {
    materialType: "ERSA",
    baseUnit: "EA",
    materialGroup: "Mechanical"
  },

  /* Easy-to-edit Pipe dropdown lists */
  lists: {
    material: ["MS", "CS", "SS", "GI"],
    shape: ["Round", "Square"],
    pipeType: ["SL"],
    sizeSystem: ["Inch", "mm"],
    inchSize: ["1/2", "3/4", "1", "1.1/4", "1.1/2", "2", "2.1/2", "3", "4", "5", "6", "8", "10", "12", "14", "16", "18", "20", "24"],
    schedule: ["10", "20", "30", "40", "60", "80", "120", "160"]
  },

  /* Easy-to-edit material colors for the drawing */
  materialColors: {
    "MS": { c1: "#A3ACB8", c2: "#6B7280", c3: "#3F4651", cs: "#1F2937" },
    "CS": { c1: "#7F8A97", c2: "#525C68", c3: "#2B333D", cs: "#111827" },
    "SS": { c1: "#FFFFFF", c2: "#D5DCE4", c3: "#7D8896", cs: "#5A6572" },
    "GI": { c1: "#F8FAFC", c2: "#DCE4EC", c3: "#94A3B8", cs: "#64748B" }
  },

  /* Easy-to-edit plain-word meanings for Long text */
  meanings: {
    material: {
      "MS": "Mild Steel",
      "CS": "Carbon Steel",
      "SS": "Stainless Steel",
      "GI": "Galvanized Iron"
    },
    pipeType: {
      "SL": "seamless"
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
    const formatInchSize = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? clean(otherVal) : clean(choice);
      if (!raw) return "";
      const core = raw.replace(/"/g, "").trim().toUpperCase();
      return core ? (core + '"') : "";
    };
    const formatSchedule = function (choice, otherVal) {
      const raw = resolveChoice(choice, otherVal);
      if (!raw) return "";
      return /^SCH/.test(raw) ? raw : ("SCH" + raw);
    };

    const material = resolveChoice(values.material, values.materialOther);
    const shape = clean(values.shape) || "Round";
    const pipeType = resolveChoice(values.pipeType, values.pipeTypeOther);
    const sizeSystem = clean(values.sizeSystem) || "Inch";

    const inchSize = formatInchSize(values.inchSize, values.inchSizeOther);
    const schedule = formatSchedule(values.schedule, values.scheduleOther);
    const mmOd = upper(values.mmOd);
    const mmThk = upper(values.mmThk);
    const sqWidth = upper(values.sqWidth);
    const sqHeight = upper(values.sqHeight);
    const sqThk = upper(values.sqThk);

    const hasAnyField = Boolean(
      material ||
      shape !== "Round" ||
      (shape === "Round" && (
        pipeType ||
        sizeSystem !== "Inch" ||
        inchSize || schedule || mmOd || mmThk
      )) ||
      (shape === "Square" && (sqWidth || sqHeight || sqThk))
    );
    if (!hasAnyField) {
      return "";
    }

    const matPart = material || "?";

    if (shape === "Square") {
      const dimPart = (sqWidth || "?") + "X" + (sqHeight || "?") + "X" + (sqThk || "?");
      return ["SQUARE", matPart, "PIPE", dimPart].join(" ");
    }

    const typePart = pipeType || "?";
    if (sizeSystem === "mm") {
      const mmDim = (mmOd || "?") + "X" + (mmThk || "?");
      return [matPart, "PIPE", typePart, mmDim].join(" ");
    }

    const sizePart = inchSize || "?";
    const schPart = schedule || "?";
    return [matPart, "PIPE", typePart, sizePart, schPart].join(" ");
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
      if (choice === "__OTHER__") return clean(otherVal);
      return clean(choice);
    };

    const matRaw = resolveChoice(values.material, values.materialOther);
    const matCode = upper(matRaw);
    const shape = clean(values.shape) || "Round";
    const typeRaw = resolveChoice(values.pipeType, values.pipeTypeOther);
    const typeCode = upper(typeRaw);
    const sizeSystem = clean(values.sizeSystem) || "Inch";

    const inchRaw = (values.inchSize === "__OTHER__" ? clean(values.inchSizeOther) : clean(values.inchSize)).replace(/"/g, "").trim();
    const schRaw = resolveChoice(values.schedule, values.scheduleOther);
    const schClean = schRaw ? schRaw.replace(/^SCH/i, "").trim() : "";
    const mmOd = clean(values.mmOd);
    const mmThk = clean(values.mmThk);
    const sqWidth = clean(values.sqWidth);
    const sqHeight = clean(values.sqHeight);
    const sqThk = clean(values.sqThk);

    const hasAnyField = Boolean(
      matRaw ||
      shape !== "Round" ||
      (shape === "Round" && (
        typeRaw ||
        sizeSystem !== "Inch" ||
        inchRaw || schClean || mmOd || mmThk
      )) ||
      (shape === "Square" && (sqWidth || sqHeight || sqThk))
    );
    if (!hasAnyField) {
      return "";
    }

    const matText = matCode ? ((mod.meanings.material[matCode] || matRaw) + " Material") : "";

    if (shape === "Square") {
      const lead = [matText, "square pipe"].filter(Boolean).join(" ");
      const dimParts = [];
      if (sqWidth) dimParts.push("width=" + sqWidth + " mm");
      if (sqHeight) dimParts.push("height=" + sqHeight + " mm");
      if (sqThk) dimParts.push("thickness=" + sqThk + " mm");

      let dimClause = "";
      if (dimParts.length === 3) {
        dimClause = "with " + dimParts[0] + ", " + dimParts[1] + " and " + dimParts[2];
      } else if (dimParts.length === 2) {
        dimClause = "with " + dimParts[0] + " and " + dimParts[1];
      } else if (dimParts.length === 1) {
        dimClause = "with " + dimParts[0];
      }

      const sentence = [lead, dimClause].filter(Boolean).join(" ");
      return sentence ? (sentence + ".") : "";
    }

    const typeWord = typeCode ? (mod.meanings.pipeType[typeCode] || typeRaw) : "";
    const lead = [matText, typeWord, "pipe"].filter(Boolean).join(" ");

    const dimParts = [];
    if (sizeSystem === "mm") {
      if (mmOd) dimParts.push("outer diameter=" + mmOd + " mm");
      if (mmThk) dimParts.push("thickness=" + mmThk + " mm");
    } else {
      if (inchRaw) dimParts.push("size=" + inchRaw + " inch");
      if (schClean) dimParts.push("schedule=" + schClean);
    }

    const dimClause = dimParts.length > 0 ? ("with " + dimParts.join(" and ")) : "";
    const sentence = [lead, dimClause].filter(Boolean).join(" ");
    return sentence ? (sentence + ".") : "";
  },

  /* Find which Required fields are still empty */
  getMissingRequired: function (values) {
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const resolveChoice = function (choice, otherVal) {
      if (choice === "__OTHER__") return clean(otherVal);
      return clean(choice);
    };

    const missing = [];
    if (!resolveChoice(values.material, values.materialOther)) missing.push("Material");
    const shape = clean(values.shape) || "Round";

    if (shape === "Square") {
      if (!clean(values.sqWidth)) missing.push("Width");
      if (!clean(values.sqHeight)) missing.push("Height");
      if (!clean(values.sqThk)) missing.push("Thickness");
      return missing;
    }

    if (!resolveChoice(values.pipeType, values.pipeTypeOther)) missing.push("Pipe type");
    const sizeSystem = clean(values.sizeSystem) || "Inch";
    if (sizeSystem === "mm") {
      if (!clean(values.mmOd)) missing.push("OD");
      if (!clean(values.mmThk)) missing.push("Thickness");
    } else {
      if (!resolveChoice(values.inchSize, values.inchSizeOther)) missing.push("Size");
      if (!resolveChoice(values.schedule, values.scheduleOther)) missing.push("Schedule");
    }
    return missing;
  },

  /* Build crisp side-view + end-view SVG drawing with 3D shading & compressed size scaling */
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
    const clamp = function (v, lo, hi) {
      return Math.max(lo, Math.min(hi, v));
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

    const material = resolveChoice(values.material, values.materialOther);
    const shape = clean(values.shape) || "Round";
    const pipeType = resolveChoice(values.pipeType, values.pipeTypeOther);
    const sizeSystem = clean(values.sizeSystem) || "Inch";

    const inchRaw = (values.inchSize === "__OTHER__" ? clean(values.inchSizeOther) : clean(values.inchSize)).replace(/"/g, "").trim().toUpperCase();
    const inchDisplay = inchRaw ? (inchRaw + '"') : "";
    const schRaw = resolveChoice(values.schedule, values.scheduleOther);
    const schDisplay = schRaw ? (/^SCH/.test(schRaw) ? schRaw : ("SCH" + schRaw)) : "";
    const mmOd = upper(values.mmOd);
    const mmThk = upper(values.mmThk);
    const sqWidth = upper(values.sqWidth);
    const sqHeight = upper(values.sqHeight);
    const sqThk = upper(values.sqThk);

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
    const uid = "pipe-g" + mod._svgUid + "-" + Math.random().toString(36).slice(2, 6);
    const gCyl = uid + "-cyl";
    const gEnd = uid + "-end";
    const gSqTop = uid + "-sqt";
    const gSqFront = uid + "-sqf";

    const defsSvg =
      "<defs>" +
        '<linearGradient id="' + gCyl + '" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="' + c3 + '" />' +
          '<stop offset="25%" stop-color="' + c1 + '" />' +
          '<stop offset="50%" stop-color="' + c2 + '" />' +
          '<stop offset="100%" stop-color="' + c3 + '" />' +
        "</linearGradient>" +
        '<linearGradient id="' + gEnd + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="' + c1 + '" />' +
          '<stop offset="55%" stop-color="' + c2 + '" />' +
          '<stop offset="100%" stop-color="' + c3 + '" />' +
        "</linearGradient>" +
        '<linearGradient id="' + gSqTop + '" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="' + c1 + '" />' +
          '<stop offset="100%" stop-color="' + c2 + '" />' +
        "</linearGradient>" +
        '<linearGradient id="' + gSqFront + '" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="' + c2 + '" />' +
          '<stop offset="100%" stop-color="' + c3 + '" />' +
        "</linearGradient>" +
      "</defs>";

    const topText = clean(shortNameText);
    const topLines = topText ? wrapLines(topText, 36) : ["NEW PIPE"];
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

    const reqColor = "#10302A";
    const optColor = "#0F3B33";
    const missingColor = "#64748B";
    const yOffset = topShift;
    const cy = 118 + yOffset;
    const sx1 = 62;
    const sx2 = 216;
    const ex = 304;

    const INCH_OD_MM = {
      "1/2": 21.3, "3/4": 26.7, "1": 33.4, "1.1/4": 42.2, "1.1/2": 48.3,
      "2": 60.3, "2.1/2": 73.0, "3": 88.9, "4": 114.3, "5": 141.3,
      "6": 168.3, "8": 219.1, "10": 273.1, "12": 323.9, "14": 355.6,
      "16": 406.4, "18": 457.2, "20": 508.0, "24": 609.6
    };
    const SCH_FACTORS = {
      "SCH10": 0.04, "SCH20": 0.05, "SCH30": 0.06, "SCH40": 0.07,
      "SCH60": 0.09, "SCH80": 0.11, "SCH120": 0.14, "SCH160": 0.17
    };

    let shapeSvg = "";
    let labelsSvg = "";
    let halfH = 25;

    if (shape === "Square") {
      const wParsed = parseFloat(sqWidth);
      const hParsed = parseFloat(sqHeight);
      const tParsed = parseFloat(sqThk);
      const wMm = (sqWidth && !isNaN(wParsed) && wParsed > 0) ? wParsed : 60;
      const hMm = (sqHeight && !isNaN(hParsed) && hParsed > 0) ? hParsed : 60;
      const tMm = (sqThk && !isNaN(tParsed) && tParsed > 0) ? tParsed : 4;

      const maxSideMm = Math.max(wMm, hMm);
      const minSideMm = Math.min(wMm, hMm);
      const maxSidePx = 28 + 84 * Math.sqrt(clamp((maxSideMm - 20) / 380, 0, 1));
      const wPx = maxSidePx * (wMm / maxSideMm);
      const hPx = maxSidePx * (hMm / maxSideMm);
      const minSidePx = Math.min(wPx, hPx);

      const wallRatio = clamp(tMm / maxSideMm, 0.02, 0.25);
      const wallPx = Math.min(minSidePx * 0.30, Math.max(2.5, maxSidePx * wallRatio));

      halfH = hPx / 2;
      const halfWEnd = wPx / 2;
      const yTop = cy - halfH;
      const yBot = cy + halfH;
      const topFaceH = Math.max(3, Math.min(12, hPx * 0.24));

      shapeSvg =
        '<rect x="' + sx1 + '" y="' + f2(yTop) + '" width="' + (sx2 - sx1) + '" height="' + f2(topFaceH) + '" fill="url(#' + gSqTop + ')" stroke="' + cs + '" stroke-width="1.05" />' +
        '<rect x="' + sx1 + '" y="' + f2(yTop + topFaceH) + '" width="' + (sx2 - sx1) + '" height="' + f2(hPx - topFaceH) + '" fill="url(#' + gSqFront + ')" stroke="' + cs + '" stroke-width="1.05" />' +
        '<line x1="' + sx1 + '" y1="' + f2(yTop + wallPx) + '" x2="' + sx2 + '" y2="' + f2(yTop + wallPx) + '" stroke="' + c3 + '" stroke-width="1" stroke-dasharray="4 3" />' +
        '<line x1="' + sx1 + '" y1="' + f2(yBot - wallPx) + '" x2="' + sx2 + '" y2="' + f2(yBot - wallPx) + '" stroke="' + c3 + '" stroke-width="1" stroke-dasharray="4 3" />' +
        '<text x="' + ex + '" y="' + f2(yTop - 12) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#476B62">End view</text>' +
        '<rect x="' + f2(ex - halfWEnd) + '" y="' + f2(yTop) + '" width="' + f2(wPx) + '" height="' + f2(hPx) + '" fill="url(#' + gEnd + ')" stroke="' + cs + '" stroke-width="1.15" />' +
        '<rect x="' + f2(ex - halfWEnd + wallPx) + '" y="' + f2(yTop + wallPx) + '" width="' + f2(Math.max(2, wPx - wallPx * 2)) + '" height="' + f2(Math.max(2, hPx - wallPx * 2)) + '" fill="#FFFFFF" stroke="' + cs + '" stroke-width="1.05" />';

      const whLabel = "Width x Height: " + (sqWidth || "?") + " x " + (sqHeight || "?") + ((sqWidth || sqHeight) ? " mm" : "");
      const whOk = Boolean(sqWidth && sqHeight);
      const thkLabel = sqThk ? ("Thickness: " + sqThk + " mm") : "Thickness: ?";

      labelsSvg =
        '<line x1="42" y1="' + f2(yTop) + '" x2="' + (sx1 - 4) + '" y2="' + f2(yTop) + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
        '<line x1="42" y1="' + f2(yBot) + '" x2="' + (sx1 - 4) + '" y2="' + f2(yBot) + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
        '<line x1="48" y1="' + f2(yTop + 3) + '" x2="48" y2="' + f2(yBot - 3) + '" stroke="' + (whOk ? reqColor : missingColor) + '" stroke-width="1" />' +
        '<polygon points="48,' + f2(yTop) + " 45," + f2(yTop + 6) + " 51," + f2(yTop + 6) + '" fill="' + (whOk ? reqColor : missingColor) + '" />' +
        '<polygon points="48,' + f2(yBot) + " 45," + f2(yBot - 6) + " 51," + f2(yBot - 6) + '" fill="' + (whOk ? reqColor : missingColor) + '" />' +
        '<text x="' + Math.round((sx1 + sx2) / 2) + '" y="' + f2(yTop - 12) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (whOk ? reqColor : missingColor) + '">' + esc(whLabel) + "</text>" +
        '<polyline points="' + f2(ex + halfWEnd - wallPx * 0.5) + "," + f2(yTop + wallPx * 0.5) + " " + f2(ex + halfWEnd + 6) + "," + f2(yTop - 14) + '" fill="none" stroke="' + (sqThk ? reqColor : missingColor) + '" stroke-width="1" />' +
        '<circle cx="' + f2(ex + halfWEnd - wallPx * 0.5) + '" cy="' + f2(yTop + wallPx * 0.5) + '" r="2" fill="' + (sqThk ? reqColor : missingColor) + '" />' +
        '<text x="' + ex + '" y="' + f2(yBot + 18) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (sqThk ? reqColor : missingColor) + '">' + esc(thkLabel) + "</text>";
    } else {
      /* Round pipe */
      let odMm = 60.3;
      if (sizeSystem === "mm") {
        const odParsed = parseFloat(mmOd);
        if (mmOd && !isNaN(odParsed) && odParsed > 0) odMm = odParsed;
      } else {
        odMm = INCH_OD_MM[inchRaw] || 60.3;
      }

      const Dpx = 28 + 84 * Math.sqrt(clamp((odMm - 21) / 589, 0, 1));
      let wallPx = Math.max(2.5, Dpx * 0.07);
      if (sizeSystem === "mm") {
        const thkParsed = parseFloat(mmThk);
        if (mmThk && !isNaN(thkParsed) && thkParsed > 0) {
          const ratio = clamp(thkParsed / odMm, 0.02, 0.25);
          wallPx = Math.max(2.5, Dpx * ratio);
        }
      } else {
        const schFactor = SCH_FACTORS[schDisplay] || 0.07;
        wallPx = Math.max(2.5, Dpx * schFactor);
      }
      wallPx = Math.min(wallPx, Dpx * 0.42);

      halfH = Dpx / 2;
      const yTop = cy - halfH;
      const yBot = cy + halfH;
      const innerR = Math.max(2, halfH - wallPx);
      const hlY = yTop + Dpx * 0.22;

      shapeSvg =
        '<rect x="' + sx1 + '" y="' + f2(yTop) + '" width="' + (sx2 - sx1) + '" height="' + f2(Dpx) + '" fill="url(#' + gCyl + ')" stroke="' + cs + '" stroke-width="1.15" />' +
        '<line x1="' + (sx1 + 4) + '" y1="' + f2(hlY) + '" x2="' + (sx2 - 4) + '" y2="' + f2(hlY) + '" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" opacity="0.5" />' +
        '<line x1="' + sx1 + '" y1="' + f2(yTop + wallPx) + '" x2="' + sx2 + '" y2="' + f2(yTop + wallPx) + '" stroke="' + c3 + '" stroke-width="1" stroke-dasharray="4 3" />' +
        '<line x1="' + sx1 + '" y1="' + f2(yBot - wallPx) + '" x2="' + sx2 + '" y2="' + f2(yBot - wallPx) + '" stroke="' + c3 + '" stroke-width="1" stroke-dasharray="4 3" />' +
        '<line x1="' + (sx1 + 3) + '" y1="' + f2(yTop) + '" x2="' + sx1 + '" y2="' + f2(yTop + wallPx) + '" stroke="' + cs + '" stroke-width="0.9" />' +
        '<line x1="' + (sx2 - 3) + '" y1="' + f2(yTop) + '" x2="' + sx2 + '" y2="' + f2(yTop + wallPx) + '" stroke="' + cs + '" stroke-width="0.9" />' +
        '<text x="' + ex + '" y="' + f2(yTop - 12) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#476B62">End view</text>' +
        '<circle cx="' + ex + '" cy="' + cy + '" r="' + f2(halfH) + '" fill="url(#' + gEnd + ')" stroke="' + cs + '" stroke-width="1.15" />' +
        '<circle cx="' + ex + '" cy="' + cy + '" r="' + f2(innerR) + '" fill="#FFFFFF" stroke="' + cs + '" stroke-width="1.05" />';

      const primaryDimLabel = sizeSystem === "mm"
        ? (mmOd ? ("OD: " + mmOd + " mm") : "OD: ?")
        : (inchDisplay ? ("Size: " + inchDisplay) : "Size: ?");
      const primaryOk = sizeSystem === "mm" ? Boolean(mmOd) : Boolean(inchDisplay);

      const wallLabel = sizeSystem === "mm"
        ? (mmThk ? ("Thickness: " + mmThk + " mm") : "Thickness: ?")
        : (schDisplay ? ("Schedule: " + schDisplay) : "Schedule: ?");
      const wallOk = sizeSystem === "mm" ? Boolean(mmThk) : Boolean(schDisplay);

      labelsSvg =
        '<line x1="42" y1="' + f2(yTop) + '" x2="' + (sx1 - 4) + '" y2="' + f2(yTop) + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
        '<line x1="42" y1="' + f2(yBot) + '" x2="' + (sx1 - 4) + '" y2="' + f2(yBot) + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
        '<line x1="48" y1="' + f2(yTop + 3) + '" x2="48" y2="' + f2(yBot - 3) + '" stroke="' + (primaryOk ? reqColor : missingColor) + '" stroke-width="1" />' +
        '<polygon points="48,' + f2(yTop) + " 45," + f2(yTop + 6) + " 51," + f2(yTop + 6) + '" fill="' + (primaryOk ? reqColor : missingColor) + '" />' +
        '<polygon points="48,' + f2(yBot) + " 45," + f2(yBot - 6) + " 51," + f2(yBot - 6) + '" fill="' + (primaryOk ? reqColor : missingColor) + '" />' +
        '<text x="' + Math.round((sx1 + sx2) / 2) + '" y="' + f2(yTop - 12) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (primaryOk ? reqColor : missingColor) + '">' + esc(primaryDimLabel) + "</text>" +
        '<line x1="' + ex + '" y1="' + f2(yBot - wallPx * 0.5) + '" x2="' + ex + '" y2="' + f2(yBot + 7) + '" stroke="' + (wallOk ? reqColor : missingColor) + '" stroke-width="1" />' +
        '<circle cx="' + ex + '" cy="' + f2(yBot - wallPx * 0.5) + '" r="2" fill="' + (wallOk ? reqColor : missingColor) + '" />' +
        '<text x="' + ex + '" y="' + f2(yBot + 19) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (wallOk ? reqColor : missingColor) + '">' + esc(wallLabel) + "</text>";
    }

    const noteY = cy + halfH + 34;
    const relNoteSvg =
      '<text x="366" y="' + f2(noteY) + '" text-anchor="end" font-size="9.5" font-weight="600" fill="#64748B">Size drawn relative, not to true scale</text>';

    /* Info lines below drawing showing all selected options */
    const infoStartY = noteY + 22;
    const matLabel = material ? ("Material: " + material) : "Material: ?";
    const matCol = material ? reqColor : missingColor;

    const specsParts = ["Shape: " + shape];
    if (shape === "Round") {
      specsParts.push("Type: " + (pipeType || "?"));
      specsParts.push("Unit: " + sizeSystem);
    }
    const specsLines = wrapLines(specsParts.join("  |  "), 46);

    const infoSvg =
      '<circle cx="132" cy="' + f2(infoStartY - 4) + '" r="5" fill="' + c2 + '" stroke="' + cs + '" stroke-width="1" />' +
      '<text x="142" y="' + f2(infoStartY) + '" text-anchor="start" font-size="12" font-weight="700" fill="' + matCol + '">' + esc(matLabel) + "</text>" +
      specsLines.map(function (line, i) {
        const y = infoStartY + 18 + i * 16;
        return '<text x="190" y="' + f2(y) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + optColor + '">' + esc(line) + "</text>";
      }).join("");

    const totalHeight = Math.round(infoStartY + 18 + specsLines.length * 16 + 12);

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" shape-rendering="geometricPrecision" role="img" aria-label="Pipe technical drawing">' +
        defsSvg +
        '<rect x="0" y="0" width="380" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        '<g class="bolt-shape-animate">' +
          shapeSvg +
        "</g>" +
        labelsSvg +
        relNoteSvg +
        infoSvg +
      "</svg>"
    );
  },

  /* Draw the Pipe screen */
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
        '<button type="button" class="back-btn" id="pipe-back-btn" aria-label="Back to Rules">' +
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
            '<button type="button" class="btn-secondary" id="pipe-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="pipe-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="pipe-name-box" class="name-textarea" rows="2" aria-label="SAP Short Text" autocapitalize="characters" spellcheck="false" placeholder="PICK FIELDS BELOW TO BUILD NAME..."></textarea>' +

        '<div class="name-meta-row">' +
          '<span id="pipe-char-counter" class="char-counter">0 / 40</span>' +
          '<p id="pipe-missing-note" class="missing-note"></p>' +
        '</div>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 2;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Long text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="pipe-long-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="pipe-long-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="pipe-long-box" class="name-textarea long-textarea" rows="3" aria-label="Long text" placeholder="Pick fields below to build long text..."></textarea>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 3;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Drawing</h2>' +
        '</div>' +
        '<div id="pipe-drawing-frame" class="drawing-frame"></div>' +
      '</section>' +

      '<section class="card add-export-card card-stagger" style="--card-index: 4;">' +
        '<button type="button" class="btn-primary add-export-btn" id="pipe-add-export-btn">Add to export list</button>' +
        '<p id="pipe-export-feedback" class="add-export-feedback is-hidden" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card card-stagger" style="--card-index: 5;">' +
        '<div class="fields-grid">' +
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="pipe-material">Material</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="pipe-material" class="field-control">' +
              makeOptionsHtml(mod.lists.material, "Select material", true) +
            '</select>' +
            '<input id="pipe-material-other" type="text" class="field-control" style="display: none;" placeholder="Type material code" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="pipe-shape">Shape</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="pipe-shape" class="field-control">' +
              '<option value="Round" selected>Round</option>' +
              '<option value="Square">Square</option>' +
            '</select>' +
          '</div>' +

          '<div class="field-group" data-round-group="1">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="pipe-type">Pipe type</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="pipe-type" class="field-control">' +
              makeOptionsHtml(mod.lists.pipeType, "Select pipe type", true) +
            '</select>' +
            '<input id="pipe-type-other" type="text" class="field-control" style="display: none;" placeholder="Type pipe type, e.g. ERW" />' +
          '</div>' +

          '<div class="field-group" data-round-group="1">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="pipe-size-system">Size system</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="pipe-size-system" class="field-control">' +
              '<option value="Inch" selected>Inch</option>' +
              '<option value="mm">mm</option>' +
            '</select>' +
          '</div>' +

          '<div class="field-group" data-inch-group="1">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="pipe-inch-size">Size (inch)</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="pipe-inch-size" class="field-control">' +
              makeOptionsHtml(mod.lists.inchSize, "Select size", true) +
            '</select>' +
            '<input id="pipe-inch-size-other" type="text" class="field-control" style="display: none;" placeholder="Type inch size, e.g. 6.1/4" />' +
          '</div>' +

          '<div class="field-group" data-inch-group="1">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="pipe-schedule">Schedule</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="pipe-schedule" class="field-control">' +
              makeOptionsHtml(mod.lists.schedule, "Select schedule", true) +
            '</select>' +
            '<input id="pipe-schedule-other" type="text" class="field-control" style="display: none;" placeholder="Type schedule, e.g. 10S" />' +
          '</div>' +

          '<div class="field-group" data-mm-group="1" style="display: none;">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="pipe-mm-od">OD (mm)</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<input id="pipe-mm-od" type="number" inputmode="decimal" min="0" step="any" class="field-control" placeholder="e.g. 100" />' +
          '</div>' +

          '<div class="field-group" data-mm-group="1" style="display: none;">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="pipe-mm-thk">Thickness (mm)</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<input id="pipe-mm-thk" type="number" inputmode="decimal" min="0" step="any" class="field-control" placeholder="e.g. 4" />' +
          '</div>' +

          '<div class="field-group" data-square-group="1" style="display: none;">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="pipe-sq-width">Width (mm)</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<input id="pipe-sq-width" type="number" inputmode="decimal" min="0" step="any" class="field-control" placeholder="e.g. 100" />' +
          '</div>' +

          '<div class="field-group" data-square-group="1" style="display: none;">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="pipe-sq-height">Height (mm)</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<input id="pipe-sq-height" type="number" inputmode="decimal" min="0" step="any" class="field-control" placeholder="e.g. 100" />' +
          '</div>' +

          '<div class="field-group" data-square-group="1" style="display: none;">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="pipe-sq-thk">Thickness (mm)</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<input id="pipe-sq-thk" type="number" inputmode="decimal" min="0" step="any" class="field-control" placeholder="e.g. 6" />' +
          '</div>' +
        '</div>' +
      '</section>';

    const backBtn = document.getElementById("pipe-back-btn");
    const nameBox = document.getElementById("pipe-name-box");
    const charCounter = document.getElementById("pipe-char-counter");
    const missingNote = document.getElementById("pipe-missing-note");
    const rebuildBtn = document.getElementById("pipe-rebuild-btn");
    const copyBtn = document.getElementById("pipe-copy-btn");
    const longBox = document.getElementById("pipe-long-box");
    const longRebuildBtn = document.getElementById("pipe-long-rebuild-btn");
    const longCopyBtn = document.getElementById("pipe-long-copy-btn");
    const drawingFrame = document.getElementById("pipe-drawing-frame");
    const addExportBtn = document.getElementById("pipe-add-export-btn");
    const exportFeedback = document.getElementById("pipe-export-feedback");

    const inputs = {
      material: document.getElementById("pipe-material"),
      materialOther: document.getElementById("pipe-material-other"),
      shape: document.getElementById("pipe-shape"),
      pipeType: document.getElementById("pipe-type"),
      pipeTypeOther: document.getElementById("pipe-type-other"),
      sizeSystem: document.getElementById("pipe-size-system"),
      inchSize: document.getElementById("pipe-inch-size"),
      inchSizeOther: document.getElementById("pipe-inch-size-other"),
      schedule: document.getElementById("pipe-schedule"),
      scheduleOther: document.getElementById("pipe-schedule-other"),
      mmOd: document.getElementById("pipe-mm-od"),
      mmThk: document.getElementById("pipe-mm-thk"),
      sqWidth: document.getElementById("pipe-sq-width"),
      sqHeight: document.getElementById("pipe-sq-height"),
      sqThk: document.getElementById("pipe-sq-thk")
    };

    const roundGroups = Array.from(container.querySelectorAll('[data-round-group="1"]'));
    const inchGroups = Array.from(container.querySelectorAll('[data-inch-group="1"]'));
    const mmGroups = Array.from(container.querySelectorAll('[data-mm-group="1"]'));
    const squareGroups = Array.from(container.querySelectorAll('[data-square-group="1"]'));

    function syncConditionalControls() {
      inputs.materialOther.style.display = inputs.material.value === "__OTHER__" ? "" : "none";
      inputs.pipeTypeOther.style.display = inputs.pipeType.value === "__OTHER__" ? "" : "none";
      inputs.inchSizeOther.style.display = inputs.inchSize.value === "__OTHER__" ? "" : "none";
      inputs.scheduleOther.style.display = inputs.schedule.value === "__OTHER__" ? "" : "none";

      const isSquare = inputs.shape.value === "Square";
      const isMm = inputs.sizeSystem.value === "mm";

      roundGroups.forEach(function (el) { el.style.display = isSquare ? "none" : ""; });
      squareGroups.forEach(function (el) { el.style.display = isSquare ? "" : "none"; });
      inchGroups.forEach(function (el) { el.style.display = (!isSquare && !isMm) ? "" : "none"; });
      mmGroups.forEach(function (el) { el.style.display = (!isSquare && isMm) ? "" : "none"; });
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
