/* ----- HOSE JOINT MODULE ----- */
window.QS_MODULES.push({
  id: "hosejoint",
  name: "Hose joint",
  searchWords: ["HOSE JOINT", "FERRULE JOINT", "BARB JOINT"],
  tileBg: "#D8F5EA",
  tileColor: "#0D3A2F",
  iconSvg:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="8.5" y="7.5" width="7" height="9" rx="1"></rect>' +
      '<path d="M2 10h6.5v4H2"></path>' +
      '<path d="M4.2 10v4"></path>' +
      '<path d="M6.3 10v4"></path>' +
      '<path d="M15.5 10H22v4h-6.5"></path>' +
      '<path d="M18 10v4"></path>' +
      '<path d="M20 10v4"></path>' +
      '<path d="M12 7.5v9"></path>' +
    '</svg>',

  /* SAP export defaults for Hose joint */
  exportDefaults: {
    materialType: "ERSA",
    baseUnit: "EA",
    materialGroup: "Mechanical"
  },

  /* Easy-to-edit Hose joint dropdown lists */
  lists: {
    material: ["SS", "BRASS", "MS", "GI"],
    grade: ["304", "316"],
    shape: ["Straight", "Elbow 90", "Tee"],
    endLetter: [
      { code: "B", label: "B (barb)" },
      { code: "M", label: "M (male thread)" },
      { code: "F", label: "F (female thread)" },
      { code: "S", label: "S (swivel)" },
      { code: "C", label: "C (compression)" }
    ],
    sizeUnit: [
      { code: "inch", label: "inch" },
      { code: "mm", label: "mm" }
    ],
    inchSize: ["1/4", "3/8", "1/2", "3/4", "1", "1.1/4", "1.1/2", "1.3/4", "2", "2.1/4", "2.1/2", "2.3/4", "3"],
    threadType: ["BSPP", "BSPT", "NPT"]
  },

  /* Easy-to-edit material colors for the drawing */
  materialColors: {
    "SS": { fill: "#E8EEF4", shade: "#CBD5E1", stroke: "#475569", detail: "#64748B", dot: "#DCE5EE", shine: true },
    "BRASS": { fill: "#E9C46A", shade: "#CCA03F", stroke: "#7C5810", detail: "#9A7018", dot: "#E0B347", shine: false },
    "MS": { fill: "#6B7280", shade: "#4B5563", stroke: "#1F2937", detail: "#374151", dot: "#5B6472", shine: false },
    "GI": { fill: "#F1F5F9", shade: "#DCE4EC", stroke: "#64748B", detail: "#94A3B8", dot: "#E5ECF3", shine: false }
  },

  /* Easy-to-edit plain-word meanings for Long text */
  meanings: {
    material: {
      "SS": "Stainless Steel",
      "BRASS": "Brass",
      "MS": "Mild Steel",
      "GI": "Galvanized Iron"
    },
    endLetter: {
      "B": "barbed",
      "M": "male thread",
      "F": "female thread",
      "S": "swivel (thread with a turning nut)",
      "C": "compression (nut and ferrule)"
    },
    shape: {
      "Straight": "straight",
      "Elbow 90": "90 degree elbow",
      "Tee": "tee with the third end as branch"
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
    const lower = function (v) {
      return clean(v).toLowerCase();
    };
    const resolveChoice = function (choice, otherVal) {
      if (choice === "__OTHER__") return upper(otherVal);
      return upper(choice);
    };
    const formatEndSize = function (unitVal, inchChoice, inchOther, mmVal) {
      const unit = lower(unitVal) === "mm" ? "mm" : "inch";
      if (unit === "mm") {
        let num = upper(mmVal);
        if (!num) return "";
        num = num.replace(/MM$/i, "").trim();
        return num ? (num + "MM") : "";
      }
      let inchRaw = inchChoice === "__OTHER__" ? clean(inchOther) : clean(inchChoice);
      if (!inchRaw) return "";
      inchRaw = inchRaw.replace(/"/g, "").trim().toUpperCase();
      return inchRaw ? (inchRaw + '"') : "";
    };
    const formatEndCode = function (letter, sizeText) {
      const l = upper(letter);
      if (!l && !sizeText) return "?";
      return (l || "?") + (sizeText || "?");
    };

    const material = resolveChoice(values.material, values.materialOther);
    const grade = resolveChoice(values.grade, values.gradeOther);
    const shape = clean(values.shape) || "Straight";
    const threadType = resolveChoice(values.threadType, values.threadTypeOther);

    const end1Letter = upper(values.end1Letter);
    const end1Size = formatEndSize(values.end1Unit, values.end1SizeInch, values.end1SizeOther, values.end1SizeMm);
    const end2Letter = upper(values.end2Letter);
    const end2Size = formatEndSize(values.end2Unit, values.end2SizeInch, values.end2SizeOther, values.end2SizeMm);
    const end3Letter = upper(values.end3Letter);
    const end3Size = formatEndSize(values.end3Unit, values.end3SizeInch, values.end3SizeOther, values.end3SizeMm);

    const hasAnyField = Boolean(
      material ||
      grade ||
      (shape && shape !== "Straight") ||
      threadType ||
      end1Letter || end1Size ||
      end2Letter || end2Size ||
      (shape === "Tee" && (end3Letter || end3Size))
    );
    if (!hasAnyField) {
      return "";
    }

    const allCompression = shape === "Tee"
      ? (end1Letter === "C" && end2Letter === "C" && end3Letter === "C")
      : (end1Letter === "C" && end2Letter === "C");
    const family = allCompression ? "FERRULE JOINT" : "HOSE JOINT";

    const end1Code = formatEndCode(end1Letter, end1Size);
    const end2Code = formatEndCode(end2Letter, end2Size);
    const endsPart = shape === "Tee"
      ? (end1Code + "X" + end2Code + "X" + formatEndCode(end3Letter, end3Size))
      : (end1Code + "X" + end2Code);

    const matPart = material || "?";
    const elbowPart = shape === "Elbow 90" ? "90" : "";

    return [matPart, grade, family, elbowPart, endsPart]
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
    const lower = function (v) {
      return clean(v).toLowerCase();
    };
    const resolveChoice = function (choice, otherVal) {
      if (choice === "__OTHER__") return clean(otherVal);
      return clean(choice);
    };
    const formatSizeWords = function (unitVal, inchChoice, inchOther, mmVal) {
      const unit = lower(unitVal) === "mm" ? "mm" : "inch";
      if (unit === "mm") {
        let num = clean(mmVal).replace(/mm$/i, "").trim();
        return num ? (num + " mm") : "";
      }
      let inchRaw = inchChoice === "__OTHER__" ? clean(inchOther) : clean(inchChoice);
      inchRaw = inchRaw.replace(/"/g, "").trim();
      return inchRaw ? (inchRaw + " inch") : "";
    };

    const matRaw = resolveChoice(values.material, values.materialOther);
    const matCode = upper(matRaw);
    const gradeRaw = resolveChoice(values.grade, values.gradeOther);
    const gradeCode = upper(gradeRaw);
    const shape = clean(values.shape) || "Straight";
    const threadType = resolveChoice(values.threadType, values.threadTypeOther);

    const end1Letter = upper(values.end1Letter);
    const end1SizeWords = formatSizeWords(values.end1Unit, values.end1SizeInch, values.end1SizeOther, values.end1SizeMm);
    const end2Letter = upper(values.end2Letter);
    const end2SizeWords = formatSizeWords(values.end2Unit, values.end2SizeInch, values.end2SizeOther, values.end2SizeMm);
    const end3Letter = upper(values.end3Letter);
    const end3SizeWords = formatSizeWords(values.end3Unit, values.end3SizeInch, values.end3SizeOther, values.end3SizeMm);

    const hasAnyField = Boolean(
      matCode ||
      gradeCode ||
      (shape && shape !== "Straight") ||
      threadType ||
      end1Letter || end1SizeWords ||
      end2Letter || end2SizeWords ||
      (shape === "Tee" && (end3Letter || end3SizeWords))
    );
    if (!hasAnyField) {
      return "";
    }

    const allCompression = shape === "Tee"
      ? (end1Letter === "C" && end2Letter === "C" && end3Letter === "C")
      : (end1Letter === "C" && end2Letter === "C");
    const familyWord = allCompression ? "ferrule joint" : "hose joint";

    const matText = matCode ? (mod.meanings.material[matCode] || matRaw) : "";
    let gradeNote = "";
    if (gradeCode) {
      const isSteel = matCode === "SS" || matCode === "MS" || matCode === "GI";
      const label = [matCode || matRaw, gradeCode].filter(Boolean).join(" ");
      gradeNote = "(" + label + (isSteel ? " = the steel grade)" : " = the grade)");
    }

    const leadPhrase = [matText, gradeNote, familyWord].filter(Boolean).join(" ");
    const parts = [];
    if (leadPhrase) {
      parts.push(leadPhrase);
    }

    const shapeText = mod.meanings.shape[shape] || clean(shape).toLowerCase();
    if (shapeText) {
      parts.push(shapeText);
    }

    const buildEndLong = function (label, letter, sizeWords) {
      if (!letter && !sizeWords) return;
      let letterWord = letter ? (mod.meanings.endLetter[letter] || letter) : "";
      const isThreaded = letter === "M" || letter === "F" || letter === "S";
      if (isThreaded && threadType) {
        letterWord = letterWord + " (" + threadType + ")";
      }
      const sizeClause = sizeWords ? ("with size " + sizeWords) : "";
      const phrase = [label, letterWord, sizeClause].filter(Boolean).join(" ");
      if (phrase) parts.push(phrase);
    };

    buildEndLong("first end", end1Letter, end1SizeWords);
    buildEndLong("second end", end2Letter, end2SizeWords);
    if (shape === "Tee") {
      buildEndLong("third end", end3Letter, end3SizeWords);
    }

    const joined = parts.join(", ");
    if (!joined) return "";
    return joined.charAt(0).toUpperCase() + joined.slice(1) + ".";
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
    const hasEndSize = function (unitVal, inchChoice, inchOther, mmVal) {
      if (String(unitVal || "").toLowerCase() === "mm") {
        return Boolean(clean(mmVal));
      }
      return Boolean(resolveChoice(inchChoice, inchOther));
    };

    const missing = [];
    if (!resolveChoice(values.material, values.materialOther)) missing.push("Material");
    const shape = clean(values.shape) || "Straight";
    if (!shape) missing.push("Shape");

    if (!clean(values.end1Letter) || !hasEndSize(values.end1Unit, values.end1SizeInch, values.end1SizeOther, values.end1SizeMm)) {
      missing.push("End 1");
    }
    if (!clean(values.end2Letter) || !hasEndSize(values.end2Unit, values.end2SizeInch, values.end2SizeOther, values.end2SizeMm)) {
      missing.push("End 2");
    }
    if (shape === "Tee") {
      if (!clean(values.end3Letter) || !hasEndSize(values.end3Unit, values.end3SizeInch, values.end3SizeOther, values.end3SizeMm)) {
        missing.push("End 3");
      }
    }
    return missing;
  },

  /* Build crisp side-view live SVG drawing with end symbols & selected option labels */
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
    const resolveChoice = function (choice, otherVal) {
      if (choice === "__OTHER__") return upper(otherVal);
      return upper(choice);
    };
    const formatEndSize = function (unitVal, inchChoice, inchOther, mmVal) {
      const unit = lower(unitVal) === "mm" ? "mm" : "inch";
      if (unit === "mm") {
        let num = upper(mmVal).replace(/MM$/i, "").trim();
        return num ? (num + "MM") : "";
      }
      let inchRaw = (inchChoice === "__OTHER__" ? clean(inchOther) : clean(inchChoice)).replace(/"/g, "").trim().toUpperCase();
      return inchRaw ? (inchRaw + '"') : "";
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
    const grade = resolveChoice(values.grade, values.gradeOther);
    const shape = clean(values.shape) || "Straight";
    const threadType = resolveChoice(values.threadType, values.threadTypeOther);

    const end1Letter = upper(values.end1Letter);
    const end1Size = formatEndSize(values.end1Unit, values.end1SizeInch, values.end1SizeOther, values.end1SizeMm);
    const end2Letter = upper(values.end2Letter);
    const end2Size = formatEndSize(values.end2Unit, values.end2SizeInch, values.end2SizeOther, values.end2SizeMm);
    const end3Letter = upper(values.end3Letter);
    const end3Size = formatEndSize(values.end3Unit, values.end3SizeInch, values.end3SizeOther, values.end3SizeMm);

    const allCompression = shape === "Tee"
      ? (end1Letter === "C" && end2Letter === "C" && end3Letter === "C")
      : (end1Letter === "C" && end2Letter === "C");
    const family = allCompression ? "FERRULE JOINT" : "HOSE JOINT";

    const matPalette = (material && mod.materialColors && mod.materialColors[material]) ? mod.materialColors[material] : null;
    const hasMat = Boolean(material);
    const useShine = Boolean(matPalette && matPalette.shine);
    const fillColor = matPalette
      ? (useShine ? "url(#hj-ss-grad)" : matPalette.fill)
      : (hasMat ? "#D5DCE3" : "#EEF2F6");
    const shadeColor = matPalette ? matPalette.shade : (hasMat ? "#BCC7D2" : "#E2E8F0");
    const strokeColor = matPalette ? matPalette.stroke : (hasMat ? "#475569" : "#94A3B8");
    const detailColor = matPalette ? matPalette.detail : (hasMat ? "#64748B" : "#94A3B8");
    const dotColor = matPalette ? matPalette.dot : (hasMat ? "#D5DCE3" : "#EEF2F6");

    const defsSvg = useShine
      ? '<defs><linearGradient id="hj-ss-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#F8FAFC" />' +
          '<stop offset="38%" stop-color="#FFFFFF" />' +
          '<stop offset="72%" stop-color="#CBD5E1" />' +
          '<stop offset="100%" stop-color="#F1F5F9" />' +
        '</linearGradient></defs>'
      : "";

    const topText = clean(shortNameText);
    const topLines = topText ? wrapLines(topText, 36) : ["NEW HOSE JOINT"];
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

    const drawEndSymbol = function (dir, letter, bx, by) {
      /* dir: "left" (-x), "right" (+x), "down" (+y) from base point (bx, by) */
      const tx = dir === "left" ? -1 : (dir === "right" ? 1 : 0);
      const ty = dir === "down" ? 1 : 0;
      const px = dir === "down" ? 1 : 0;
      const py = dir === "down" ? 0 : 1;

      const pt = function (along, perp) {
        return (bx + along * tx + perp * px) + "," + (by + along * ty + perp * py);
      };
      const poly = function (pts, fill, sw) {
        return '<polygon points="' + pts.map(function (p) { return pt(p[0], p[1]); }).join(" ") + '" fill="' + fill + '" stroke="' + strokeColor + '" stroke-width="' + (sw || 1.2) + '" stroke-linejoin="miter" />';
      };
      const line = function (a1, p1, a2, p2, col, sw, dash) {
        const dashAttr = dash ? (' stroke-dasharray="' + dash + '"') : "";
        return '<line x1="' + (bx + a1 * tx + p1 * px) + '" y1="' + (by + a1 * ty + p1 * py) + '" x2="' + (bx + a2 * tx + p2 * px) + '" y2="' + (by + a2 * ty + p2 * py) + '" stroke="' + (col || strokeColor) + '" stroke-width="' + (sw || 1) + '"' + dashAttr + ' />';
      };

      if (letter === "B") {
        /* Barbed spigot with 3 crisp ribs */
        return (
          poly([[0, -10], [46, -10], [50, -8], [50, 8], [46, 10], [0, 10]], fillColor) +
          poly([[10, -10], [16, -15], [18, -15], [18, 15], [16, 15], [10, 10]], shadeColor, 1) +
          poly([[24, -10], [30, -15], [32, -15], [32, 15], [30, 15], [24, 10]], shadeColor, 1) +
          poly([[38, -10], [44, -15], [46, -15], [46, 15], [44, 15], [38, 10]], shadeColor, 1) +
          line(18, -14, 18, 14, detailColor, 0.9) +
          line(32, -14, 32, 14, detailColor, 0.9) +
          line(46, -14, 46, 14, detailColor, 0.9)
        );
      }

      if (letter === "M") {
        /* Male thread spigot with crisp diagonal thread lines */
        let s = poly([[0, -13], [44, -13], [48, -10], [48, 10], [44, 13], [0, 13]], fillColor);
        for (let a = 6; a <= 40; a += 6) {
          s += line(a, -12, a + 3, 12, detailColor, 1);
        }
        s += line(44, -13, 44, 13, strokeColor, 1);
        return s;
      }

      if (letter === "F") {
        /* Female thread: hex collar + internal bore & dashed thread lines */
        return (
          poly([[0, -19], [40, -19], [40, 19], [0, 19]], fillColor) +
          line(0, -10, 40, -10, strokeColor, 1) +
          line(0, 10, 40, 10, strokeColor, 1) +
          poly([[18, -10], [40, -10], [40, 10], [18, 10]], shadeColor, 1) +
          line(22, -7, 38, -7, detailColor, 1, "3 2") +
          line(22, 7, 38, 7, detailColor, 1, "3 2")
        );
      }

      if (letter === "S") {
        /* Swivel: inner stem + turning hex nut collar */
        return (
          poly([[0, -11], [14, -11], [14, 11], [0, 11]], fillColor) +
          poly([[14, -20], [40, -20], [40, 20], [14, 20]], shadeColor) +
          line(14, -11, 40, -11, strokeColor, 1) +
          line(14, 11, 40, 11, strokeColor, 1) +
          poly([[40, -10], [50, -7], [50, 7], [40, 10]], fillColor) +
          line(27, -20, 27, 20, detailColor, 0.9)
        );
      }

      if (letter === "C") {
        /* Compression: tube stub + olive/ring + hex compression nut */
        return (
          poly([[0, -11], [54, -11], [54, 11], [0, 11]], fillColor) +
          poly([[6, -15], [14, -15], [14, 15], [6, 15]], shadeColor, 1.1) +
          poly([[18, -20], [40, -20], [40, 20], [18, 20]], shadeColor) +
          line(18, -11, 40, -11, strokeColor, 1) +
          line(18, 11, 40, 11, strokeColor, 1)
        );
      }

      /* Empty end: light neutral stub */
      return poly([[0, -11], [38, -11], [38, 11], [0, 11]], fillColor);
    };

    const yOffset = topShift;
    const cx = 190;
    const cy = shape === "Straight" ? (158 + yOffset) : (136 + yOffset);
    let bodySvg = "";
    let endsSvg = "";
    let calloutsSvg = "";

    const formatEndLabel = function (prefix, letter, size) {
      if (!letter && !size) return prefix + ": ?";
      return prefix + ": " + (letter || "?") + (size || "?");
    };

    const reqColor = "#10302A";
    const missingColor = "#64748B";
    const optColor = "#0F3B33";

    if (shape === "Elbow 90") {
      /* 90 degree elbow block at (cx, cy) -> End 1 left, End 2 down */
      bodySvg =
        '<path d="M' + (cx - 24) + ' ' + (cy - 18) +
        ' H' + (cx + 12) +
        ' L' + (cx + 18) + ' ' + (cy - 12) +
        ' V' + (cy + 24) +
        ' H' + (cx - 18) +
        ' V' + (cy + 18) +
        ' H' + (cx - 24) +
        ' Z" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" stroke-linejoin="miter" />' +
        '<line x1="' + (cx - 24) + '" y1="' + (cy - 18) + '" x2="' + (cx - 18) + '" y2="' + (cy + 18) + '" stroke="' + shadeColor + '" stroke-width="1" />';
      endsSvg =
        drawEndSymbol("left", end1Letter, cx - 24, cy) +
        drawEndSymbol("down", end2Letter, cx, cy + 24);

      const e1Txt = formatEndLabel("END 1", end1Letter, end1Size);
      const e2Txt = formatEndLabel("END 2", end2Letter, end2Size);
      const e1Ok = Boolean(end1Letter && end1Size);
      const e2Ok = Boolean(end2Letter && end2Size);

      calloutsSvg =
        '<polyline points="' + (cx - 68) + ',' + cy + ' ' + (cx - 76) + ',' + (cy - 34) + ' ' + (cx - 82) + ',' + (cy - 34) + '" fill="none" stroke="' + (e1Ok ? reqColor : missingColor) + '" stroke-width="1" />' +
        '<circle cx="' + (cx - 68) + '" cy="' + cy + '" r="2" fill="' + (e1Ok ? reqColor : missingColor) + '" />' +
        '<text x="' + (cx - 86) + '" y="' + (cy - 30) + '" text-anchor="end" font-size="11.5" font-weight="700" fill="' + (e1Ok ? reqColor : missingColor) + '">' + esc(e1Txt) + '</text>' +

        '<polyline points="' + (cx + 16) + ',' + (cy + 68) + ' ' + (cx + 34) + ',' + (cy + 68) + '" fill="none" stroke="' + (e2Ok ? reqColor : missingColor) + '" stroke-width="1" />' +
        '<circle cx="' + (cx + 16) + '" cy="' + (cy + 68) + '" r="2" fill="' + (e2Ok ? reqColor : missingColor) + '" />' +
        '<text x="' + (cx + 38) + '" y="' + (cy + 72) + '" text-anchor="start" font-size="11.5" font-weight="700" fill="' + (e2Ok ? reqColor : missingColor) + '">' + esc(e2Txt) + '</text>';
    } else if (shape === "Tee") {
      /* Tee junction at (cx, cy) -> End 1 left, End 2 right, End 3 down (branch) */
      bodySvg =
        '<polygon points="' +
          (cx - 24) + ',' + (cy - 18) + ' ' +
          (cx + 24) + ',' + (cy - 18) + ' ' +
          (cx + 24) + ',' + (cy + 18) + ' ' +
          (cx + 18) + ',' + (cy + 18) + ' ' +
          (cx + 18) + ',' + (cy + 26) + ' ' +
          (cx - 18) + ',' + (cy + 26) + ' ' +
          (cx - 18) + ',' + (cy + 18) + ' ' +
          (cx - 24) + ',' + (cy + 18) +
        '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" stroke-linejoin="miter" />' +
        '<rect x="' + (cx - 16) + '" y="' + (cy - 12) + '" width="32" height="24" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1" />';
      endsSvg =
        drawEndSymbol("left", end1Letter, cx - 24, cy) +
        drawEndSymbol("right", end2Letter, cx + 24, cy) +
        drawEndSymbol("down", end3Letter, cx, cy + 26);

      const e1Txt = formatEndLabel("END 1", end1Letter, end1Size);
      const e2Txt = formatEndLabel("END 2", end2Letter, end2Size);
      const e3Txt = formatEndLabel("BRANCH 3", end3Letter, end3Size);
      const e1Ok = Boolean(end1Letter && end1Size);
      const e2Ok = Boolean(end2Letter && end2Size);
      const e3Ok = Boolean(end3Letter && end3Size);

      calloutsSvg =
        '<line x1="' + (cx - 56) + '" y1="' + (cy - 14) + '" x2="' + (cx - 56) + '" y2="' + (cy - 34) + '" stroke="' + (e1Ok ? reqColor : missingColor) + '" stroke-width="1" />' +
        '<circle cx="' + (cx - 56) + '" cy="' + (cy - 14) + '" r="2" fill="' + (e1Ok ? reqColor : missingColor) + '" />' +
        '<text x="' + (cx - 56) + '" y="' + (cy - 39) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (e1Ok ? reqColor : missingColor) + '">' + esc(e1Txt) + '</text>' +

        '<line x1="' + (cx + 56) + '" y1="' + (cy - 14) + '" x2="' + (cx + 56) + '" y2="' + (cy - 34) + '" stroke="' + (e2Ok ? reqColor : missingColor) + '" stroke-width="1" />' +
        '<circle cx="' + (cx + 56) + '" cy="' + (cy - 14) + '" r="2" fill="' + (e2Ok ? reqColor : missingColor) + '" />' +
        '<text x="' + (cx + 56) + '" y="' + (cy - 39) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (e2Ok ? reqColor : missingColor) + '">' + esc(e2Txt) + '</text>' +

        '<polyline points="' + (cx + 16) + ',' + (cy + 68) + ' ' + (cx + 34) + ',' + (cy + 68) + '" fill="none" stroke="' + (e3Ok ? reqColor : missingColor) + '" stroke-width="1" />' +
        '<circle cx="' + (cx + 16) + '" cy="' + (cy + 68) + '" r="2" fill="' + (e3Ok ? reqColor : missingColor) + '" />' +
        '<text x="' + (cx + 38) + '" y="' + (cy + 72) + '" text-anchor="start" font-size="11.5" font-weight="700" fill="' + (e3Ok ? reqColor : missingColor) + '">' + esc(e3Txt) + '</text>';
    } else {
      /* Straight center hex nut body -> End 1 left, End 2 right */
      bodySvg =
        '<rect x="' + (cx - 22) + '" y="' + (cy - 21) + '" width="44" height="42" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.2" />' +
        '<line x1="' + (cx - 22) + '" y1="' + (cy - 10) + '" x2="' + (cx + 22) + '" y2="' + (cy - 10) + '" stroke="' + strokeColor + '" stroke-width="1" />' +
        '<line x1="' + (cx - 22) + '" y1="' + (cy + 10) + '" x2="' + (cx + 22) + '" y2="' + (cy + 10) + '" stroke="' + strokeColor + '" stroke-width="1" />';
      endsSvg =
        drawEndSymbol("left", end1Letter, cx - 22, cy) +
        drawEndSymbol("right", end2Letter, cx + 22, cy);

      const e1Txt = formatEndLabel("END 1", end1Letter, end1Size);
      const e2Txt = formatEndLabel("END 2", end2Letter, end2Size);
      const e1Ok = Boolean(end1Letter && end1Size);
      const e2Ok = Boolean(end2Letter && end2Size);

      calloutsSvg =
        '<line x1="' + (cx - 56) + '" y1="' + (cy - 14) + '" x2="' + (cx - 56) + '" y2="' + (cy - 40) + '" stroke="' + (e1Ok ? reqColor : missingColor) + '" stroke-width="1" />' +
        '<circle cx="' + (cx - 56) + '" cy="' + (cy - 14) + '" r="2" fill="' + (e1Ok ? reqColor : missingColor) + '" />' +
        '<text x="' + (cx - 56) + '" y="' + (cy - 45) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (e1Ok ? reqColor : missingColor) + '">' + esc(e1Txt) + '</text>' +

        '<line x1="' + (cx + 56) + '" y1="' + (cy - 14) + '" x2="' + (cx + 56) + '" y2="' + (cy - 40) + '" stroke="' + (e2Ok ? reqColor : missingColor) + '" stroke-width="1" />' +
        '<circle cx="' + (cx + 56) + '" cy="' + (cy - 14) + '" r="2" fill="' + (e2Ok ? reqColor : missingColor) + '" />' +
        '<text x="' + (cx + 56) + '" y="' + (cy - 45) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (e2Ok ? reqColor : missingColor) + '">' + esc(e2Txt) + '</text>';
    }

    /* Info lines below drawing showing every selected option */
    const infoStartY = shape === "Straight" ? (218 + yOffset) : (254 + yOffset);
    const matLabel = material ? ("Material: " + material + (grade ? (" " + grade) : "")) : "Material: ?";
    const matCol = material ? reqColor : missingColor;

    const specsParts = [
      "Shape: " + shape,
      "Type: " + family
    ];
    if (threadType) specsParts.push("Thread: " + threadType);
    const specsLines = wrapLines(specsParts.join("  |  "), 46);

    const infoSvg =
      '<circle cx="132" cy="' + (infoStartY - 4) + '" r="5" fill="' + dotColor + '" stroke="' + strokeColor + '" stroke-width="1" />' +
      '<text x="142" y="' + infoStartY + '" text-anchor="start" font-size="12" font-weight="700" fill="' + matCol + '">' + esc(matLabel) + '</text>' +
      specsLines.map(function (line, i) {
        const y = infoStartY + 18 + i * 16;
        return '<text x="190" y="' + y + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + optColor + '">' + esc(line) + '</text>';
      }).join("");

    const totalHeight = infoStartY + 18 + specsLines.length * 16 + 12;

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" shape-rendering="geometricPrecision" role="img" aria-label="Hose joint technical drawing">' +
        defsSvg +
        '<rect x="0" y="0" width="380" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        '<g class="bolt-shape-animate">' +
          bodySvg +
          endsSvg +
        '</g>' +
        calloutsSvg +
        infoSvg +
      '</svg>'
    );
  },

  /* Draw the Hose joint screen */
  renderScreen: function (container, goBack) {
    const mod = this;

    function makeOptionsHtml(items, placeholderText, includeOther) {
      const opts = placeholderText ? ['<option value="">' + placeholderText + '</option>'] : [];
      items.forEach(function (item) {
        if (typeof item === "object") {
          opts.push('<option value="' + item.code + '">' + item.label + '</option>');
        } else {
          opts.push('<option value="' + item + '">' + item + '</option>');
        }
      });
      if (includeOther) {
        opts.push('<option value="__OTHER__">Other (type it)</option>');
      }
      return opts.join("");
    }

    function buildEndControlsHtml(num, sectionLabel, isOptionalHidden) {
      const hiddenStyle = isOptionalHidden ? ' style="display: none;"' : '';
      const groupAttr = ' data-end-group="' + num + '"' + hiddenStyle;
      return (
        '<p class="fields-subsection-title"' + groupAttr + '>' + sectionLabel + '</p>' +

        '<div class="field-group"' + groupAttr + '>' +
          '<div class="field-label-row">' +
            '<label class="field-label" for="hj-end' + num + '-letter">End ' + num + ' type</label>' +
            '<span class="field-tag is-required">Required</span>' +
          '</div>' +
          '<select id="hj-end' + num + '-letter" class="field-control">' +
            makeOptionsHtml(mod.lists.endLetter, "Select end type", false) +
          '</select>' +
        '</div>' +

        '<div class="field-group"' + groupAttr + '>' +
          '<div class="field-label-row">' +
            '<label class="field-label" for="hj-end' + num + '-unit">End ' + num + ' unit</label>' +
            '<span class="field-tag is-required">Required</span>' +
          '</div>' +
          '<select id="hj-end' + num + '-unit" class="field-control">' +
            makeOptionsHtml(mod.lists.sizeUnit, "", false) +
          '</select>' +
        '</div>' +

        '<div class="field-group"' + groupAttr + '>' +
          '<div class="field-label-row">' +
            '<label class="field-label" for="hj-end' + num + '-size-inch">End ' + num + ' size</label>' +
            '<span class="field-tag is-required">Required</span>' +
          '</div>' +
          '<select id="hj-end' + num + '-size-inch" class="field-control">' +
            makeOptionsHtml(mod.lists.inchSize, "Select size", true) +
          '</select>' +
          '<input id="hj-end' + num + '-size-other" type="text" class="field-control" style="display: none;" placeholder="Type inch size, e.g. 5/8" />' +
          '<input id="hj-end' + num + '-size-mm" type="number" inputmode="decimal" min="0" step="any" class="field-control" style="display: none;" placeholder="e.g. 10" />' +
        '</div>'
      );
    }

    container.innerHTML =
      '<div class="item-header card-stagger" style="--card-index: 0;">' +
        '<button type="button" class="back-btn" id="hj-back-btn" aria-label="Back to Rules">' +
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
            '<button type="button" class="btn-secondary" id="hj-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="hj-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="hj-name-box" class="name-textarea" rows="2" aria-label="SAP Short Text" autocapitalize="characters" spellcheck="false" placeholder="PICK FIELDS BELOW TO BUILD NAME..."></textarea>' +

        '<div class="name-meta-row">' +
          '<span id="hj-char-counter" class="char-counter">0 / 40</span>' +
          '<p id="hj-missing-note" class="missing-note"></p>' +
        '</div>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 2;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Long text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="hj-long-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="hj-long-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="hj-long-box" class="name-textarea long-textarea" rows="3" aria-label="Long text" placeholder="Pick fields below to build long text..."></textarea>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 3;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Drawing</h2>' +
        '</div>' +
        '<div id="hj-drawing-frame" class="drawing-frame"></div>' +
      '</section>' +

      '<section class="card add-export-card card-stagger" style="--card-index: 4;">' +
        '<button type="button" class="btn-primary add-export-btn" id="hj-add-export-btn">Add to export list</button>' +
        '<p id="hj-export-feedback" class="add-export-feedback is-hidden" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card card-stagger" style="--card-index: 5;">' +
        '<div class="fields-grid">' +
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hj-material">Material</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="hj-material" class="field-control">' +
              makeOptionsHtml(mod.lists.material, "Select material", true) +
            '</select>' +
            '<input id="hj-material-other" type="text" class="field-control" style="display: none;" placeholder="Type material code" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hj-grade">Grade</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="hj-grade" class="field-control">' +
              makeOptionsHtml(mod.lists.grade, "Select grade", true) +
            '</select>' +
            '<input id="hj-grade-other" type="text" class="field-control" style="display: none;" placeholder="Type grade, e.g. 316L" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hj-shape">Shape</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="hj-shape" class="field-control">' +
              '<option value="Straight" selected>Straight</option>' +
              '<option value="Elbow 90">Elbow 90</option>' +
              '<option value="Tee">Tee</option>' +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="hj-thread-type">Thread type (long text only)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="hj-thread-type" class="field-control">' +
              makeOptionsHtml(mod.lists.threadType, "Select thread type", true) +
            '</select>' +
            '<input id="hj-thread-type-other" type="text" class="field-control" style="display: none;" placeholder="Type thread type" />' +
          '</div>' +

          buildEndControlsHtml(1, "END 1", false) +
          buildEndControlsHtml(2, "END 2", false) +
          buildEndControlsHtml(3, "END 3 (BRANCH)", true) +
        '</div>' +
      '</section>';

    const backBtn = document.getElementById("hj-back-btn");
    const nameBox = document.getElementById("hj-name-box");
    const charCounter = document.getElementById("hj-char-counter");
    const missingNote = document.getElementById("hj-missing-note");
    const rebuildBtn = document.getElementById("hj-rebuild-btn");
    const copyBtn = document.getElementById("hj-copy-btn");
    const longBox = document.getElementById("hj-long-box");
    const longRebuildBtn = document.getElementById("hj-long-rebuild-btn");
    const longCopyBtn = document.getElementById("hj-long-copy-btn");
    const drawingFrame = document.getElementById("hj-drawing-frame");
    const addExportBtn = document.getElementById("hj-add-export-btn");
    const exportFeedback = document.getElementById("hj-export-feedback");

    const inputs = {
      material: document.getElementById("hj-material"),
      materialOther: document.getElementById("hj-material-other"),
      grade: document.getElementById("hj-grade"),
      gradeOther: document.getElementById("hj-grade-other"),
      shape: document.getElementById("hj-shape"),
      threadType: document.getElementById("hj-thread-type"),
      threadTypeOther: document.getElementById("hj-thread-type-other"),
      end1Letter: document.getElementById("hj-end1-letter"),
      end1Unit: document.getElementById("hj-end1-unit"),
      end1SizeInch: document.getElementById("hj-end1-size-inch"),
      end1SizeOther: document.getElementById("hj-end1-size-other"),
      end1SizeMm: document.getElementById("hj-end1-size-mm"),
      end2Letter: document.getElementById("hj-end2-letter"),
      end2Unit: document.getElementById("hj-end2-unit"),
      end2SizeInch: document.getElementById("hj-end2-size-inch"),
      end2SizeOther: document.getElementById("hj-end2-size-other"),
      end2SizeMm: document.getElementById("hj-end2-size-mm"),
      end3Letter: document.getElementById("hj-end3-letter"),
      end3Unit: document.getElementById("hj-end3-unit"),
      end3SizeInch: document.getElementById("hj-end3-size-inch"),
      end3SizeOther: document.getElementById("hj-end3-size-other"),
      end3SizeMm: document.getElementById("hj-end3-size-mm")
    };

    const end3Nodes = Array.from(container.querySelectorAll('[data-end-group="3"]'));

    function syncConditionalControls() {
      inputs.materialOther.style.display = inputs.material.value === "__OTHER__" ? "" : "none";
      inputs.gradeOther.style.display = inputs.grade.value === "__OTHER__" ? "" : "none";
      inputs.threadTypeOther.style.display = inputs.threadType.value === "__OTHER__" ? "" : "none";

      [1, 2, 3].forEach(function (n) {
        const unitEl = inputs["end" + n + "Unit"];
        const inchEl = inputs["end" + n + "SizeInch"];
        const inchOtherEl = inputs["end" + n + "SizeOther"];
        const mmEl = inputs["end" + n + "SizeMm"];
        const isMm = unitEl.value === "mm";
        inchEl.style.display = isMm ? "none" : "";
        inchOtherEl.style.display = (!isMm && inchEl.value === "__OTHER__") ? "" : "none";
        mmEl.style.display = isMm ? "" : "none";
      });

      const isTee = inputs.shape.value === "Tee";
      end3Nodes.forEach(function (el) {
        el.style.display = isTee ? "" : "none";
      });
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
