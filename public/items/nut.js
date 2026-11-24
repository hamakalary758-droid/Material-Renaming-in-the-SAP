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
    "MS": { fill: "#8D99A6", shade: "#6E7B88", stroke: "#334155", thread: "#475569", dot: "#7A8694", shine: false },
    "SS": { fill: "#E8EEF4", shade: "#CBD5E1", stroke: "#475569", thread: "#64748B", dot: "#DCE5EE", shine: true },
    "GI": { fill: "#F3D26A", shade: "#D9AC36", stroke: "#7C5E10", thread: "#9A7618", dot: "#EAB308", shine: false },
    "HT": { fill: "#454C56", shade: "#2D323B", stroke: "#111827", thread: "#1F2937", dot: "#2B3038", shine: false },
    "COPPER": { fill: "#E08A54", shade: "#C06533", stroke: "#6E3213", thread: "#8A421D", dot: "#D97742", shine: false }
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

  /* Build clean side-view + head-view SVG drawing with material colors & labels */
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
        pts.push((hx + rad * Math.cos(ang)).toFixed(1) + "," + (hy + rad * Math.sin(ang)).toFixed(1));
      }
      return pts.join(" ");
    };

    const material = upper(values.material);
    const type = upper(values.type);
    const diameter = upper(values.diameter);
    const pitch = clean(values.pitch);
    const grade = upper(values.grade);
    const machine = clean(values.machine);

    const hasType = Boolean(type);
    const matPalette = (material && mod.materialColors && mod.materialColors[material]) ? mod.materialColors[material] : null;
    const useShine = Boolean(matPalette && matPalette.shine);
    const fillColor = matPalette
      ? (useShine ? "url(#nut-ss-grad)" : matPalette.fill)
      : (hasType ? "#D5DCE3" : "#EEF2F6");
    const shadeColor = matPalette ? matPalette.shade : (hasType ? "#BCC7D2" : "#E2E8F0");
    const strokeColor = matPalette ? matPalette.stroke : (hasType ? "#475569" : "#94A3B8");
    const threadColor = matPalette ? matPalette.thread : (hasType ? "#64748B" : "#CBD5E1");
    const dotColor = matPalette ? matPalette.dot : "#EEF2F6";

    const defsSvg = useShine
      ? '<defs><linearGradient id="nut-ss-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#F8FAFC" />' +
          '<stop offset="35%" stop-color="#FFFFFF" />' +
          '<stop offset="68%" stop-color="#CBD5E1" />' +
          '<stop offset="100%" stop-color="#F1F5F9" />' +
        '</linearGradient></defs>'
      : "";

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
        '</text>'
      );
    }).join("");

    /* Nut geometry anchored around cx = 158 (shifted left to leave clean Head view room) */
    const xL = 121;
    const xF1 = 139;
    const xF2 = 177;
    const xR = 195;
    const xBoreL = 144;
    const xBoreR = 172;
    const yOffset = topShift;

    const drawHexBody = function (yTop, yBot) {
      const ch = 4;
      const bodyPath =
        "M" + (xL + ch) + " " + yTop +
        " H" + (xR - ch) +
        " L" + xR + " " + (yTop + ch) +
        " V" + (yBot - ch) +
        " L" + (xR - ch) + " " + yBot +
        " H" + (xL + ch) +
        " L" + xL + " " + (yBot - ch) +
        " V" + (yTop + ch) + " Z";

      const rightShadePath =
        "M" + xF2 + " " + yTop +
        " H" + (xR - ch) +
        " L" + xR + " " + (yTop + ch) +
        " V" + (yBot - ch) +
        " L" + (xR - ch) + " " + yBot +
        " H" + xF2 + " Z";

      const leftShadePath =
        "M" + (xL + ch) + " " + yTop +
        " H" + xF1 +
        " V" + yBot +
        " H" + (xL + ch) +
        " L" + xL + " " + (yBot - ch) +
        " V" + (yTop + ch) + " Z";

      const threadTicks = [];
      for (let ty = yTop + 5; ty <= yBot - 5; ty += 5) {
        threadTicks.push(
          '<line x1="' + xBoreL + '" y1="' + ty + '" x2="' + (xBoreL + 4) + '" y2="' + (ty + 2) + '" stroke="' + threadColor + '" stroke-width="1.2" />' +
          '<line x1="' + xBoreR + '" y1="' + ty + '" x2="' + (xBoreR - 4) + '" y2="' + (ty + 2) + '" stroke="' + threadColor + '" stroke-width="1.2" />'
        );
      }

      return (
        '<path d="' + bodyPath + '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" stroke-linejoin="round" />' +
        '<path d="' + leftShadePath + '" fill="' + shadeColor + '" opacity="0.55" />' +
        '<path d="' + rightShadePath + '" fill="' + shadeColor + '" />' +
        (useShine ? '<line x1="150" y1="' + (yTop + 5) + '" x2="150" y2="' + (yBot - 5) + '" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.85" />' : '') +
        '<path d="' + bodyPath + '" fill="none" stroke="' + strokeColor + '" stroke-width="1.8" stroke-linejoin="round" />' +
        '<line x1="' + xF1 + '" y1="' + yTop + '" x2="' + xF1 + '" y2="' + yBot + '" stroke="' + strokeColor + '" stroke-width="1.4" />' +
        '<line x1="' + xF2 + '" y1="' + yTop + '" x2="' + xF2 + '" y2="' + yBot + '" stroke="' + strokeColor + '" stroke-width="1.4" />' +
        '<path d="M' + xL + ' ' + (yTop + ch) + ' Q130 ' + (yTop + ch + 3) + ' ' + xF1 + ' ' + (yTop + ch) + ' Q158 ' + (yTop + ch + 4) + ' ' + xF2 + ' ' + (yTop + ch) + ' Q186 ' + (yTop + ch + 3) + ' ' + xR + ' ' + (yTop + ch) + '" fill="none" stroke="' + strokeColor + '" stroke-width="1" opacity="0.5" />' +
        '<path d="M' + xL + ' ' + (yBot - ch) + ' Q130 ' + (yBot - ch - 3) + ' ' + xF1 + ' ' + (yBot - ch) + ' Q158 ' + (yBot - ch - 4) + ' ' + xF2 + ' ' + (yBot - ch) + ' Q186 ' + (yBot - ch - 3) + ' ' + xR + ' ' + (yBot - ch) + '" fill="none" stroke="' + strokeColor + '" stroke-width="1" opacity="0.5" />' +
        '<line x1="' + xBoreL + '" y1="' + yTop + '" x2="' + xBoreL + '" y2="' + yBot + '" stroke="' + threadColor + '" stroke-width="1.3" stroke-dasharray="3 2.5" />' +
        '<line x1="' + xBoreR + '" y1="' + yTop + '" x2="' + xBoreR + '" y2="' + yBot + '" stroke="' + threadColor + '" stroke-width="1.3" stroke-dasharray="3 2.5" />' +
        threadTicks.join("")
      );
    };

    let shapeSvg = "";
    let nutTopY = 124 + yOffset;
    let typeTargetX = xR;
    let typeTargetY = 130 + yOffset;
    let matTargetY = 152 + yOffset;
    let gradeTargetY = 172 + yOffset;

    if (type === "NYLOC") {
      const yHexTop = 134 + yOffset;
      const yHexBot = 182 + yOffset;
      nutTopY = 112 + yOffset;
      typeTargetX = 182;
      typeTargetY = 119 + yOffset;
      matTargetY = 152 + yOffset;
      gradeTargetY = 174 + yOffset;

      shapeSvg =
        /* Dark blue round nylon ring stays dark blue (#1E3A8A) */
        '<rect x="133" y="' + (112 + yOffset) + '" width="50" height="16" rx="7" fill="#1E3A8A" stroke="#0F172A" stroke-width="1.6" />' +
        '<line x1="140" y1="' + (116 + yOffset) + '" x2="176" y2="' + (116 + yOffset) + '" stroke="#60A5FA" stroke-width="1.4" stroke-linecap="round" opacity="0.7" />' +
        '<line x1="' + xBoreL + '" y1="' + (112 + yOffset) + '" x2="' + xBoreL + '" y2="' + (126 + yOffset) + '" stroke="#93C5FD" stroke-width="1.2" stroke-dasharray="2.5 2" />' +
        '<line x1="' + xBoreR + '" y1="' + (112 + yOffset) + '" x2="' + xBoreR + '" y2="' + (126 + yOffset) + '" stroke="#93C5FD" stroke-width="1.2" stroke-dasharray="2.5 2" />' +
        '<path d="M126 ' + yHexTop + ' L131 ' + (123 + yOffset) + ' H185 L190 ' + yHexTop + ' Z" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.6" stroke-linejoin="round" />' +
        drawHexBody(yHexTop, yHexBot);
    } else if (type === "SELF LOCKING") {
      const yHexTop = 134 + yOffset;
      const yHexBot = 182 + yOffset;
      nutTopY = 114 + yOffset;
      typeTargetX = 184;
      typeTargetY = 122 + yOffset;
      matTargetY = 152 + yOffset;
      gradeTargetY = 174 + yOffset;

      shapeSvg =
        '<path d="M127 ' + yHexTop + ' L134 ' + (114 + yOffset) + ' H182 L189 ' + yHexTop + ' Z" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.7" stroke-linejoin="round" />' +
        '<path d="M143 ' + (114 + yOffset) + ' v8 M158 ' + (114 + yOffset) + ' v8 M173 ' + (114 + yOffset) + ' v8" stroke="' + strokeColor + '" stroke-width="1.5" stroke-linecap="round" />' +
        '<line x1="' + xBoreL + '" y1="' + (114 + yOffset) + '" x2="' + xBoreL + '" y2="' + yHexTop + '" stroke="' + threadColor + '" stroke-width="1.2" stroke-dasharray="2.5 2" />' +
        '<line x1="' + xBoreR + '" y1="' + (114 + yOffset) + '" x2="' + xBoreR + '" y2="' + yHexTop + '" stroke="' + threadColor + '" stroke-width="1.2" stroke-dasharray="2.5 2" />' +
        drawHexBody(yHexTop, yHexBot);
    } else if (type === "THIN") {
      const yHexTop = 139 + yOffset;
      const yHexBot = 165 + yOffset;
      nutTopY = yHexTop;
      typeTargetX = xR;
      typeTargetY = 143 + yOffset;
      matTargetY = 152 + yOffset;
      gradeTargetY = 161 + yOffset;

      shapeSvg = drawHexBody(yHexTop, yHexBot);
    } else if (type === "JAM") {
      const yHexTop = 133 + yOffset;
      const yHexBot = 171 + yOffset;
      nutTopY = yHexTop;
      typeTargetX = xR;
      typeTargetY = 139 + yOffset;
      matTargetY = 152 + yOffset;
      gradeTargetY = 165 + yOffset;

      shapeSvg = drawHexBody(yHexTop, yHexBot);
    } else if (type === "COUPLING") {
      const yHexTop = 94 + yOffset;
      const yHexBot = 210 + yOffset;
      nutTopY = yHexTop;
      typeTargetX = xR;
      typeTargetY = 108 + yOffset;
      matTargetY = 152 + yOffset;
      gradeTargetY = 196 + yOffset;

      shapeSvg = drawHexBody(yHexTop, yHexBot);
    } else {
      /* HEX or No Type chosen yet */
      const yHexTop = 124 + yOffset;
      const yHexBot = 180 + yOffset;
      nutTopY = yHexTop;
      typeTargetX = xR;
      typeTargetY = 132 + yOffset;
      matTargetY = 152 + yOffset;
      gradeTargetY = 172 + yOffset;

      shapeSvg = drawHexBody(yHexTop, yHexBot);
    }

    /* Head view (top view next to side view) */
    const hx = 290;
    const hy = 200 + yOffset;
    let headShapeSvg = "";
    if (!type) {
      const hvFill = matPalette ? fillColor : "#EEF2F6";
      const hvStroke = matPalette ? strokeColor : "#94A3B8";
      headShapeSvg = '<polygon points="' + hexPoints(hx, hy, 25) + '" fill="' + hvFill + '" stroke="' + hvStroke + '" stroke-width="1.8" stroke-linejoin="round" />';
    } else if (type === "NYLOC") {
      headShapeSvg =
        '<polygon points="' + hexPoints(hx, hy, 26) + '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" stroke-linejoin="round" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="20.5" fill="none" stroke="' + shadeColor + '" stroke-width="1.1" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="14.5" fill="#1E3A8A" stroke="#0F172A" stroke-width="1.4" />' +
        '<path d="M' + (hx - 9) + ' ' + (hy - 7) + ' A11 11 0 0 1 ' + (hx + 5) + ' ' + (hy - 10) + '" fill="none" stroke="#60A5FA" stroke-width="1.3" stroke-linecap="round" opacity="0.8" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="8.5" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.3" />';
    } else {
      /* HEX, THIN, JAM, SELF LOCKING, COUPLING: hexagon with round hole in the middle */
      headShapeSvg =
        '<polygon points="' + hexPoints(hx, hy, 26) + '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.8" stroke-linejoin="round" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="20.5" fill="none" stroke="' + shadeColor + '" stroke-width="1.1" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="13" fill="none" stroke="' + threadColor + '" stroke-width="1.2" stroke-dasharray="3 2" />' +
        '<circle cx="' + hx + '" cy="' + hy + '" r="10" fill="#FFFFFF" stroke="' + strokeColor + '" stroke-width="1.6" />';
    }
    if (useShine && type) {
      headShapeSvg += '<path d="M' + (hx - 14) + ' ' + (hy - 14) + ' A18 18 0 0 1 ' + (hx + 2) + ' ' + (hy - 18) + '" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.9" />';
    }
    const headViewSvg =
      '<g class="head-view-animate">' +
        '<text x="' + hx + '" y="' + (162 + yOffset) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="#476B62">Head view</text>' +
        headShapeSvg +
      '</g>';

    /* Dimension & Pointer Labels */
    const reqColor = "#10302A";
    const optColor = "#0F3B33";
    const missingColor = "#64748B";

    /* Left side: Diameter across internal bore above nut */
    const yDiaBar = 78 + yOffset;
    const diaLabel = diameter ? ("Diameter: " + diameter) : "Diameter: ?";
    const diaColor = diameter ? reqColor : missingColor;
    const diaSvg =
      '<line x1="' + xBoreL + '" y1="' + (yDiaBar - 4) + '" x2="' + xBoreL + '" y2="' + nutTopY + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2.5 2.5" />' +
      '<line x1="' + xBoreR + '" y1="' + (yDiaBar - 4) + '" x2="' + xBoreR + '" y2="' + nutTopY + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2.5 2.5" />' +
      '<line x1="112" y1="' + yDiaBar + '" x2="' + xBoreR + '" y2="' + yDiaBar + '" stroke="' + diaColor + '" stroke-width="1.3" />' +
      '<polygon points="' + xBoreL + ',' + yDiaBar + ' ' + (xBoreL - 5) + ',' + (yDiaBar - 3) + ' ' + (xBoreL - 5) + ',' + (yDiaBar + 3) + '" fill="' + diaColor + '" />' +
      '<polygon points="' + xBoreR + ',' + yDiaBar + ' ' + (xBoreR + 5) + ',' + (yDiaBar - 3) + ' ' + (xBoreR + 5) + ',' + (yDiaBar + 3) + '" fill="' + diaColor + '" />' +
      '<text x="108" y="' + (yDiaBar + 4) + '" text-anchor="end" font-size="12" font-weight="700" fill="' + diaColor + '">' + esc(diaLabel) + '</text>';

    /* Left side: Pitch (only if filled) */
    let pitchSvg = "";
    if (pitch) {
      const yPitchLabel = 186 + yOffset;
      const yPitchTarget = 156 + yOffset;
      pitchSvg =
        '<polyline points="112,' + yPitchLabel + ' 118,' + yPitchLabel + ' ' + xBoreL + ',' + yPitchTarget + '" fill="none" stroke="' + optColor + '" stroke-width="1.2" />' +
        '<circle cx="' + xBoreL + '" cy="' + yPitchTarget + '" r="2.2" fill="' + optColor + '" />' +
        '<text x="108" y="' + (yPitchLabel + 4) + '" text-anchor="end" font-size="12" font-weight="700" fill="' + optColor + '">Pitch: ' + esc(pitch) + '</text>';
    }

    /* Right side: Pointer labels ordered cleanly above Head view */
    const rightPointer = function (yLabel, yTarget, xTarget, labelText, color) {
      const fontSize = labelText.length > 16 ? "11.5" : "12";
      return (
        '<polyline points="' + xTarget + ',' + yTarget + ' 204,' + yLabel + ' 212,' + yLabel + '" fill="none" stroke="' + color + '" stroke-width="1.2" />' +
        '<circle cx="' + xTarget + '" cy="' + yTarget + '" r="2.2" fill="' + color + '" />' +
        '<text x="216" y="' + (yLabel + 4) + '" text-anchor="start" font-size="' + fontSize + '" font-weight="700" fill="' + color + '">' + esc(labelText) + '</text>'
      );
    };

    const typeLabel = type ? ("Type: " + type) : "Type: ?";
    const typeSvg = rightPointer(76 + yOffset, typeTargetY, typeTargetX, typeLabel, type ? reqColor : missingColor);

    let materialSvg = "";
    if (material) {
      const yMat = 102 + yOffset;
      const matText = "Material: " + material;
      const matFs = matText.length > 15 ? "11.5" : "12";
      materialSvg =
        '<polyline points="' + xR + ',' + matTargetY + ' 204,' + yMat + ' 212,' + yMat + '" fill="none" stroke="' + optColor + '" stroke-width="1.2" />' +
        '<circle cx="' + xR + '" cy="' + matTargetY + '" r="2.2" fill="' + optColor + '" />' +
        '<circle cx="220" cy="' + yMat + '" r="4.8" fill="' + dotColor + '" stroke="' + strokeColor + '" stroke-width="1.1" />' +
        '<text x="229" y="' + (yMat + 4) + '" text-anchor="start" font-size="' + matFs + '" font-weight="700" fill="' + optColor + '">' + esc(matText) + '</text>';
    }

    const gradeLabel = grade ? ("Grade: " + grade) : "Grade: ?";
    const gradeSvg = rightPointer(128 + yOffset, gradeTargetY, xR, gradeLabel, grade ? reqColor : missingColor);

    /* Bottom: For machine (only if filled, wraps cleanly below both views) */
    let machineSvg = "";
    let machineHeight = 0;
    if (machine) {
      const machineLines = wrapLines("For machine: " + machine, 40);
      machineHeight = machineLines.length * 16 + 10;
      machineSvg = machineLines.map(function (line, i) {
        const y = 254 + yOffset + i * 16;
        return (
          '<text x="190" y="' + y + '" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F3B33">' +
            esc(line) +
          '</text>'
        );
      }).join("");
    }

    const totalHeight = Math.max(246 + yOffset + machineHeight, 260 + yOffset);

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" role="img" aria-label="Nut technical drawing">' +
        defsSvg +
        '<rect x="0" y="0" width="380" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        '<g class="bolt-shape-animate">' +
          shapeSvg +
        '</g>' +
        headViewSvg +
        diaSvg +
        pitchSvg +
        typeSvg +
        materialSvg +
        gradeSvg +
        machineSvg +
      '</svg>'
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
