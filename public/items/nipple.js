/* ----- PIPE NIPPLE MODULE ----- */
window.QS_MODULES.push({
  id: "nipple",
  name: "Pipe nipple",
  searchWords: [
    "NIPPLE",
    "HEX NIPPLE",
    "BARREL NIPPLE",
    "EXTENSION NIPPLE",
    "REDUCING NIPPLE"
  ],
  searchRegexPatterns: [
    /(^|[^a-z0-9])(?:ms|cs|ss|ss\d{3}|gi|brass|pvc|ci|steel|mild[\s-]+steel|carbon[\s-]+steel|stainless[\s-]+steel|galv(?:anized|anised)?(?:[\s-]+iron)?|cast[\s-]+iron|copper)[\s-]+(?:nippler|nipel)($|[^a-z0-9])/i,
    /(^|[^a-z0-9])(?:\d+(?:[.\s-]+\d+\/\d+|\/\d+)?\s*(?:"\s*|inch[\s-]+|in[\s-]+|mm[\s-]+|nb[\s-]+)|(?:dn|nb)\s*\d+[\s-]+|\d+\/\d+[\s-]+)(?:nippler|nipel)($|[^a-z0-9])/i
  ],
  notAScrewWords: [
    "GREASE NIPPLE",
    "GREASE NIPPLER",
    "GREASE",
    "HOSE NIPPLER",
    "HOSE NIPPLE",
    "HOSE",
    "HOSES",
    "HYDRAULIC",
    "HYD",
    "LUBRICATION"
  ],
  tileBg: "#D6F6E9",
  tileColor: "#0D3A2F",
  iconSvg:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M3 9h6v6H3z"></path>' +
      '<path d="M15 9h6v6h-6z"></path>' +
      '<rect x="9" y="7" width="6" height="10" rx="1"></rect>' +
      '<path d="M5 9v6"></path>' +
      '<path d="M7 9v6"></path>' +
      '<path d="M17 9v6"></path>' +
      '<path d="M19 9v6"></path>' +
    '</svg>',

  /* SAP export defaults for Pipe nipple */
  exportDefaults: {
    materialType: "ERSA",
    baseUnit: "EA",
    materialGroup: "Mechanical"
  },

  /* Easy-to-edit Pipe nipple dropdown lists */
  lists: {
    material: ["MS", "CS", "SS", "GI", "BRASS", "PVC", "CI"],
    type: ["HEX", "BARREL", "EXTENSION", "REDUCING"],
    endType: [
      { code: "THD", label: "THD (threaded)" },
      { code: "W", label: "W (weldable)" }
    ],
    inchSize: ["1/8", "1/4", "3/8", "1/2", "3/4", "1", "1.1/4", "1.1/2", "2", "2.1/2", "3", "4", "5", "6", "8", "10", "12"],
    thread: ["BSPT", "NPT", "BSPP"],
    classOrSch: ["SCH10S", "SCH20", "SCH40", "SCH80", "SCH160", "150#", "300#", "600#", "2000#", "3000#", "6000#"]
  },

  /* Easy-to-edit material colors for the drawing */
  materialColors: {
    "MS": { fill: "#6B7280", shade: "#4B5563", stroke: "#1F2937", detail: "#374151", dot: "#5B6472", shine: false },
    "CS": { fill: "#525C68", shade: "#363F4A", stroke: "#111827", detail: "#1F2937", dot: "#414A54", shine: false },
    "SS": { fill: "#E8EEF4", shade: "#CBD5E1", stroke: "#475569", detail: "#64748B", dot: "#DCE5EE", shine: true },
    "GI": { fill: "#F1F5F9", shade: "#DCE4EC", stroke: "#64748B", detail: "#94A3B8", dot: "#E5ECF3", shine: false },
    "BRASS": { fill: "#E9C46A", shade: "#CCA03F", stroke: "#7C5810", detail: "#9A7018", dot: "#E0B347", shine: false },
    "PVC": { fill: "#CBD5E1", shade: "#94A3B8", stroke: "#334155", detail: "#475569", dot: "#B8C4D4", shine: false },
    "CI": { fill: "#4B5563", shade: "#374151", stroke: "#111827", detail: "#1F2937", dot: "#434C59", shine: false }
  },

  /* Easy-to-edit plain-word meanings for Long text */
  meanings: {
    material: {
      "MS": "Mild steel",
      "CS": "Carbon steel",
      "SS": "Stainless steel",
      "GI": "Galvanized iron",
      "BRASS": "Brass",
      "PVC": "PVC",
      "CI": "Cast iron"
    },
    type: {
      "HEX": "hex nipple",
      "BARREL": "barrel nipple",
      "EXTENSION": "extension nipple",
      "REDUCING": "reducing nipple"
    },
    endType: {
      "THD": "threaded",
      "W": "weldable"
    }
  },

  /* Build SAP Short Text (max 40 chars, never auto-cut) */
  buildShortText: function (values) {
    const clean = function (v) {
      return String(v || "").trim().replace(/\s+/g, " ");
    };
    const upper = function (v) {
      return clean(v).toUpperCase();
    };
    const normalizeMaterial = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw) return "";
      if (raw === "STEEL" || raw === "MILD STEEL") return "MS";
      if (raw === "GALVANIZED" || raw === "GALVANISED" || raw === "GALVANIZED IRON") return "GI";
      if (raw === "CARBON STEEL") return "CS";
      if (raw === "STAINLESS STEEL") return "SS";
      if (raw === "CAST IRON") return "CI";
      return raw;
    };
    const normalizeType = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw || raw === "NONE" || raw === "PLAIN") return "";
      return raw;
    };
    const normalizeThread = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw) return "";
      if (raw === "CONICAL" || raw.indexOf("CONICAL") !== -1) return "BSPT";
      return raw;
    };
    const formatInchSize = function (choice, otherVal) {
      if (choice === "__OTHER__") {
        const typed = String(otherVal || "").trim();
        if (!typed) return "";
        return /"$/.test(typed) ? typed : (typed + '"');
      }
      const picked = clean(choice);
      if (!picked) return "";
      const core = picked.replace(/"/g, "").toUpperCase();
      return core ? (core + '"') : "";
    };
    const formatClassOrSch = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw) return "";
      if (/^SCH/.test(raw)) return raw;
      if (/#/.test(raw) || /CLASS|LB/.test(raw)) return raw;
      if (/^(?:5|10|20|30|40|60|80|100|120|140|160)S?$/.test(raw) || /^(?:STD|XS|XXS)$/.test(raw)) {
        return "SCH" + raw;
      }
      return raw;
    };
    const parseInchValue = function (sizeStr) {
      if (!sizeStr) return NaN;
      const s = String(sizeStr).replace(/"/g, "").trim();
      const mixed = s.match(/^(\d+)[.\s-]+(\d+)\/(\d+)$/);
      if (mixed) {
        return Number(mixed[1]) + (Number(mixed[2]) / Number(mixed[3]));
      }
      const frac = s.match(/^(\d+)\/(\d+)$/);
      if (frac) {
        return Number(frac[1]) / Number(frac[2]);
      }
      const num = parseFloat(s);
      return isNaN(num) ? NaN : num;
    };

    const material = normalizeMaterial(values.material, values.materialOther);
    const nippleType = normalizeType(values.type, values.typeOther);
    const isHex = nippleType === "HEX";
    const isBarrelOrExt = nippleType === "BARREL" || nippleType === "EXTENSION";

    const end1 = upper(values.end1);
    const size1 = formatInchSize(values.size1, values.size1Other);
    const end2 = upper(values.end2);
    const size2 = formatInchSize(values.size2, values.size2Other);
    const lengthRaw = upper(values.length).replace(/^L\s*=?\s*/, "").replace(/\s*MM$/, "").trim();
    const thread = normalizeThread(values.thread, values.threadOther);
    const classOrSch = formatClassOrSch(values.classOrSch, values.classOrSchOther);

    const hasAnyField = Boolean(
      material ||
      nippleType ||
      (!isHex && (end1 || end2)) ||
      size1 ||
      size2 ||
      (isBarrelOrExt && lengthRaw) ||
      thread ||
      classOrSch
    );
    if (!hasAnyField) {
      return "";
    }

    const isBspp = thread === "BSPP";
    const bothWeldable = !isHex && end1 === "W" && end2 === "W";

    let first = { end: end1, size: size1 };
    let second = { end: end2, size: size2 };
    const v1 = parseInchValue(size1);
    const v2 = parseInchValue(size2);
    if (!isNaN(v1) && !isNaN(v2) && v2 > v1) {
      first = { end: end2, size: size2 };
      second = { end: end1, size: size1 };
    }

    const formatEndPart = function (endCode, sizeStr) {
      if (isHex) {
        if (!sizeStr) return "?";
        return isBspp ? ("G" + sizeStr) : sizeStr;
      }
      if (!endCode && !sizeStr) return "?";
      const endToken = endCode === "THD" ? (isBspp ? "G" : "THD") : (endCode || "?");
      return endToken + (sizeStr || "?");
    };

    const matPart = material || "?";
    const sidesPart = formatEndPart(first.end, first.size) + "X" + formatEndPart(second.end, second.size);
    const lengthPart = isBarrelOrExt ? (lengthRaw ? ("L" + lengthRaw) : "L?") : "";

    const hasThreadedEnd = isHex || end1 === "THD" || end2 === "THD";
    let threadPart = "";
    if (!bothWeldable) {
      if (isBspp && hasThreadedEnd) {
        threadPart = "";
      } else if (thread) {
        threadPart = thread;
      } else if (hasThreadedEnd || (!end1 && !end2)) {
        threadPart = "?";
      }
    }

    const classSchPart = classOrSch || "?";

    return [matPart, nippleType, "NIPPLE", sidesPart, lengthPart, threadPart, classSchPart]
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
    const normalizeMaterial = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? clean(otherVal) : clean(choice);
      if (!raw) return "";
      const u = raw.toUpperCase();
      if (u === "STEEL" || u === "MILD STEEL") return "MS";
      if (u === "GALVANIZED" || u === "GALVANISED" || u === "GALVANIZED IRON") return "GI";
      if (u === "CARBON STEEL") return "CS";
      if (u === "STAINLESS STEEL") return "SS";
      if (u === "CAST IRON") return "CI";
      return raw;
    };
    const normalizeType = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? clean(otherVal) : clean(choice);
      const u = raw.toUpperCase();
      if (!u || u === "NONE" || u === "PLAIN") return "";
      return raw;
    };
    const normalizeThread = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? clean(otherVal) : clean(choice);
      if (!raw) return "";
      if (raw.toUpperCase().indexOf("CONICAL") !== -1) return "BSPT";
      return raw;
    };
    const formatSizeValue = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? String(otherVal || "").trim() : clean(choice);
      if (!raw) return "";
      return raw.replace(/"/g, "").trim();
    };
    const parseInchValue = function (sizeStr) {
      if (!sizeStr) return NaN;
      const s = String(sizeStr).replace(/"/g, "").trim();
      const mixed = s.match(/^(\d+)[.\s-]+(\d+)\/(\d+)$/);
      if (mixed) return Number(mixed[1]) + (Number(mixed[2]) / Number(mixed[3]));
      const frac = s.match(/^(\d+)\/(\d+)$/);
      if (frac) return Number(frac[1]) / Number(frac[2]);
      const num = parseFloat(s);
      return isNaN(num) ? NaN : num;
    };
    const formatClassOrSch = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw) return "";
      if (/^SCH/.test(raw)) return "schedule " + raw.replace(/^SCH/, "").trim();
      if (/#/.test(raw) || /CLASS|LB/.test(raw)) return "class " + raw;
      if (/^(?:5|10|20|30|40|60|80|100|120|140|160)S?$/.test(raw) || /^(?:STD|XS|XXS)$/.test(raw)) {
        return "schedule " + raw;
      }
      return "class " + raw;
    };

    const matRaw = normalizeMaterial(values.material, values.materialOther);
    const matCode = upper(matRaw);
    const typeRaw = normalizeType(values.type, values.typeOther);
    const typeCode = upper(typeRaw);
    const isHex = typeCode === "HEX";
    const isBarrelOrExt = typeCode === "BARREL" || typeCode === "EXTENSION";

    const end1 = isHex ? "THD" : upper(values.end1);
    const size1 = formatSizeValue(values.size1, values.size1Other);
    const end2 = isHex ? "THD" : upper(values.end2);
    const size2 = formatSizeValue(values.size2, values.size2Other);
    const lengthRaw = clean(values.length).replace(/^L\s*=?\s*/i, "").replace(/\s*mm$/i, "").trim();
    const threadRaw = normalizeThread(values.thread, values.threadOther);
    const threadCode = upper(threadRaw);
    const classSchPhrase = formatClassOrSch(values.classOrSch, values.classOrSchOther);

    const hasAnyField = Boolean(
      matRaw ||
      typeRaw ||
      (!isHex && (values.end1 || values.end2)) ||
      size1 ||
      size2 ||
      (isBarrelOrExt && lengthRaw) ||
      threadRaw ||
      classSchPhrase
    );
    if (!hasAnyField) {
      return "";
    }

    const matWord = matCode ? (mod.meanings.material[matCode] || matRaw) : "Not specified";
    const matLead = matWord + " material";
    const typePhrase = typeCode
      ? (mod.meanings.type[typeCode] || (typeRaw.toLowerCase() + " nipple"))
      : "plain nipple";
    const leadPhrase = matLead + " " + typePhrase;

    let first = { end: end1, size: size1 };
    let second = { end: end2, size: size2 };
    const v1 = parseInchValue(size1);
    const v2 = parseInchValue(size2);
    if (!isNaN(v1) && !isNaN(v2) && v2 > v1) {
      first = { end: end2, size: size2 };
      second = { end: end1, size: size1 };
    }

    const specParts = [];
    const sameSize = Boolean(first.size && second.size && first.size === second.size);
    const sameEnd = first.end === second.end;

    if (sameSize && sameEnd) {
      if (isHex || !first.end || first.end === "THD") {
        specParts.push("nominal size = " + first.size + " inch");
      } else {
        const endWord = mod.meanings.endType[first.end] || first.end.toLowerCase();
        specParts.push("nominal size = " + first.size + " inch (" + endWord + ")");
      }
    } else if (first.size || second.size || (!isHex && (first.end || second.end))) {
      const describeEnd = function (side) {
        const sz = side.size ? (side.size + " inch") : "not specified";
        if (isHex || !side.end) return sz;
        const ew = mod.meanings.endType[side.end] || side.end.toLowerCase();
        return sz + " (" + ew + ")";
      };
      specParts.push("nominal size end 1 = " + describeEnd(first));
      specParts.push("end 2 = " + describeEnd(second));
    }

    if (isBarrelOrExt && lengthRaw) {
      specParts.push("length = " + lengthRaw + " mm");
    }

    const bothWeldable = !isHex && end1 === "W" && end2 === "W";
    if (!bothWeldable && threadCode) {
      specParts.push("thread type = " + threadCode);
    }

    if (classSchPhrase) {
      specParts.push(classSchPhrase);
    }

    if (specParts.length === 0) {
      return leadPhrase;
    }
    return leadPhrase + " with " + specParts.join(", ");
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
    return missing;
  },

  /* Build crisp SVG nipple drawing that adapts to plain, hex, barrel, extension, reducing */
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
    const normalizeMaterial = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw) return "";
      if (raw === "STEEL" || raw === "MILD STEEL") return "MS";
      if (raw === "GALVANIZED" || raw === "GALVANISED" || raw === "GALVANIZED IRON") return "GI";
      if (raw === "CARBON STEEL") return "CS";
      if (raw === "STAINLESS STEEL") return "SS";
      if (raw === "CAST IRON") return "CI";
      return raw;
    };
    const normalizeType = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw || raw === "NONE" || raw === "PLAIN") return "";
      return raw;
    };
    const normalizeThread = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw) return "";
      if (raw.indexOf("CONICAL") !== -1) return "BSPT";
      return raw;
    };
    const formatInchSize = function (choice, otherVal) {
      if (choice === "__OTHER__") {
        const typed = String(otherVal || "").trim();
        if (!typed) return "";
        return /"$/.test(typed) ? typed : (typed + '"');
      }
      const picked = clean(choice);
      if (!picked) return "";
      const core = picked.replace(/"/g, "").toUpperCase();
      return core ? (core + '"') : "";
    };
    const formatClassOrSch = function (choice, otherVal) {
      const raw = choice === "__OTHER__" ? upper(otherVal) : upper(choice);
      if (!raw) return "";
      if (/^SCH/.test(raw) || /#/.test(raw) || /CLASS|LB/.test(raw)) return raw;
      if (/^(?:5|10|20|30|40|60|80|100|120|140|160)S?$/.test(raw) || /^(?:STD|XS|XXS)$/.test(raw)) {
        return "SCH" + raw;
      }
      return raw;
    };
    const parseInchValue = function (sizeStr) {
      if (!sizeStr) return NaN;
      const s = String(sizeStr).replace(/"/g, "").trim();
      const mixed = s.match(/^(\d+)[.\s-]+(\d+)\/(\d+)$/);
      if (mixed) return Number(mixed[1]) + (Number(mixed[2]) / Number(mixed[3]));
      const frac = s.match(/^(\d+)\/(\d+)$/);
      if (frac) return Number(frac[1]) / Number(frac[2]);
      const num = parseFloat(s);
      return isNaN(num) ? NaN : num;
    };

    const material = normalizeMaterial(values.material, values.materialOther);
    const nippleType = normalizeType(values.type, values.typeOther);
    const isHex = nippleType === "HEX";
    const isBarrelOrExt = nippleType === "BARREL" || nippleType === "EXTENSION";
    const isReducing = nippleType === "REDUCING";

    const end1 = isHex ? "THD" : upper(values.end1);
    const size1 = formatInchSize(values.size1, values.size1Other);
    const end2 = isHex ? "THD" : upper(values.end2);
    const size2 = formatInchSize(values.size2, values.size2Other);
    const lengthRaw = upper(values.length).replace(/^L\s*=?\s*/, "").replace(/\s*MM$/, "").trim();
    const thread = normalizeThread(values.thread, values.threadOther);
    const classOrSch = formatClassOrSch(values.classOrSch, values.classOrSchOther);

    let leftSide = { end: end1, size: size1 };
    let rightSide = { end: end2, size: size2 };
    const v1 = parseInchValue(size1);
    const v2 = parseInchValue(size2);
    if (!isNaN(v1) && !isNaN(v2) && v2 > v1) {
      leftSide = { end: end2, size: size2 };
      rightSide = { end: end1, size: size1 };
    }

    const sizesDiffer = !isNaN(v1) && !isNaN(v2) && v1 !== v2;
    const drawReducing = isReducing || sizesDiffer;

    const hasMat = Boolean(material);
    const matPalette = (material && mod.materialColors && mod.materialColors[material]) ? mod.materialColors[material] : null;
    const useShine = Boolean(matPalette && matPalette.shine);
    const fillColor = matPalette
      ? (useShine ? "url(#nipple-ss-grad)" : matPalette.fill)
      : (hasMat ? "#D5DCE3" : "#EEF2F6");
    const shadeColor = matPalette ? matPalette.shade : (hasMat ? "#BCC7D2" : "#E2E8F0");
    const strokeColor = matPalette ? matPalette.stroke : (hasMat ? "#475569" : "#94A3B8");
    const detailColor = matPalette ? matPalette.detail : (hasMat ? "#64748B" : "#94A3B8");
    const dotColor = matPalette ? matPalette.dot : (hasMat ? "#D5DCE3" : "#EEF2F6");

    const defsSvg = useShine
      ? '<defs><linearGradient id="nipple-ss-grad" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="#F8FAFC" />' +
          '<stop offset="35%" stop-color="#FFFFFF" />' +
          '<stop offset="70%" stop-color="#CBD5E1" />' +
          '<stop offset="100%" stop-color="#F1F5F9" />' +
        '</linearGradient></defs>'
      : "";

    const topText = clean(shortNameText);
    const topLines = topText ? wrapLines(topText, 36) : ["NEW PIPE NIPPLE"];
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

    const reqColor = "#10302A";
    const optColor = "#0F3B33";
    const missingColor = "#64748B";
    const cy = 118 + topShift;

    const buildEndDetails = function (endCode, xMouth, dirInward, halfH) {
      const effectiveEnd = endCode || (isHex ? "THD" : "");
      if (effectiveEnd === "W") {
        const bx = xMouth + dirInward * 7;
        return (
          '<line x1="' + bx + '" y1="' + (cy - halfH + 1) + '" x2="' + bx + '" y2="' + (cy + halfH - 1) + '" stroke="' + detailColor + '" stroke-width="1.1" />' +
          '<line x1="' + xMouth + '" y1="' + (cy - halfH) + '" x2="' + bx + '" y2="' + (cy - halfH + 4) + '" stroke="' + strokeColor + '" stroke-width="1" />' +
          '<line x1="' + xMouth + '" y1="' + (cy + halfH) + '" x2="' + bx + '" y2="' + (cy + halfH - 4) + '" stroke="' + strokeColor + '" stroke-width="1" />'
        );
      }
      if (effectiveEnd === "THD") {
        const lines = [];
        for (let t = 5; t <= 25; t += 5) {
          const rx = xMouth + dirInward * t;
          lines.push(
            '<line x1="' + rx + '" y1="' + (cy - halfH) + '" x2="' + rx + '" y2="' + (cy + halfH) + '" stroke="' + strokeColor + '" stroke-width="1.2" />'
          );
        }
        return lines.join("");
      }
      const dx = xMouth + dirInward * 14;
      return '<line x1="' + dx + '" y1="' + (cy - halfH) + '" x2="' + dx + '" y2="' + (cy + halfH) + '" stroke="' + strokeColor + '" stroke-width="1" stroke-dasharray="3 3" />';
    };

    let xLeft = 96;
    let xRight = 284;
    let rLeft = 24;
    let rRight = 24;
    let bodySvg = "";

    if (drawReducing) {
      xLeft = 86;
      xRight = 294;
      rLeft = 32;
      rRight = 18;
      const xStep1 = 160;
      const xStep2 = 216;
      const bodyPath =
        "M " + xLeft + " " + (cy - rLeft) +
        " L " + xStep1 + " " + (cy - rLeft) +
        " L " + xStep2 + " " + (cy - rRight) +
        " L " + xRight + " " + (cy - rRight) +
        " L " + xRight + " " + (cy + rRight) +
        " L " + xStep2 + " " + (cy + rRight) +
        " L " + xStep1 + " " + (cy + rLeft) +
        " L " + xLeft + " " + (cy + rLeft) + " Z";
      bodySvg =
        '<path d="' + bodyPath + '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" stroke-linejoin="round" />' +
        '<line x1="' + xStep1 + '" y1="' + (cy - rLeft) + '" x2="' + xStep1 + '" y2="' + (cy + rLeft) + '" stroke="' + detailColor + '" stroke-width="0.9" stroke-dasharray="3 3" />' +
        '<line x1="' + xStep2 + '" y1="' + (cy - rRight) + '" x2="' + xStep2 + '" y2="' + (cy + rRight) + '" stroke="' + detailColor + '" stroke-width="0.9" stroke-dasharray="3 3" />';
    } else if (isHex) {
      xLeft = 96;
      xRight = 284;
      rLeft = 24;
      rRight = 24;
      const hexW = 40;
      const hexX = 190 - hexW / 2;
      const hexHalfH = 38;
      bodySvg =
        '<rect x="' + xLeft + '" y="' + (cy - rLeft) + '" width="' + (xRight - xLeft) + '" height="' + (rLeft * 2) + '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" />' +
        '<rect x="' + hexX + '" y="' + (cy - hexHalfH) + '" width="' + hexW + '" height="' + (hexHalfH * 2) + '" rx="3" fill="' + shadeColor + '" stroke="' + strokeColor + '" stroke-width="1.2" />' +
        '<line x1="' + hexX + '" y1="' + (cy - 18) + '" x2="' + (hexX + hexW) + '" y2="' + (cy - 18) + '" stroke="' + strokeColor + '" stroke-width="1" />' +
        '<line x1="' + hexX + '" y1="' + (cy + 18) + '" x2="' + (hexX + hexW) + '" y2="' + (cy + 18) + '" stroke="' + strokeColor + '" stroke-width="1" />';
    } else {
      xLeft = isBarrelOrExt ? 58 : 102;
      xRight = isBarrelOrExt ? 322 : 278;
      rLeft = 24;
      rRight = 24;
      bodySvg =
        '<rect x="' + xLeft + '" y="' + (cy - rLeft) + '" width="' + (xRight - xLeft) + '" height="' + (rLeft * 2) + '" fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="1.2" />';
    }

    const leftEndDetails = buildEndDetails(leftSide.end, xLeft, 1, rLeft);
    const rightEndDetails = buildEndDetails(rightSide.end, xRight, -1, rRight);
    const centerLineSvg =
      '<line x1="' + (xLeft - 8) + '" y1="' + cy + '" x2="' + (xRight + 8) + '" y2="' + cy + '" stroke="' + detailColor + '" stroke-width="1" stroke-dasharray="5 3" />';

    const formatEndLabel = function (side) {
      if (isHex) return side.size ? ((thread === "BSPP" ? "G" : "") + side.size) : "?";
      const eTxt = side.end === "THD" ? (thread === "BSPP" ? "G" : "THD") : (side.end || "?");
      return eTxt + (side.size ? (" " + side.size) : "");
    };

    const leftLabel = formatEndLabel(leftSide);
    const rightLabel = formatEndLabel(rightSide);
    const leftTopY = cy - rLeft - 12;
    const rightTopY = cy - rRight - 12;

    const endLabelsSvg =
      '<text x="' + (xLeft + 20) + '" y="' + leftTopY + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + ((leftSide.end || leftSide.size) ? optColor : missingColor) + '">' +
        esc(leftLabel) +
      '</text>' +
      '<text x="' + (xRight - 20) + '" y="' + rightTopY + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + ((rightSide.end || rightSide.size) ? optColor : missingColor) + '">' +
        esc(rightLabel) +
      '</text>';

    const maxR = Math.max(rLeft, rRight, isHex ? 38 : 24);
    let lengthDimSvg = "";
    let infoStartY = cy + maxR + 34;

    if (isBarrelOrExt) {
      const dimY = cy + maxR + 18;
      const lenLabel = lengthRaw ? ("L = " + lengthRaw + " mm") : "L = ? mm";
      const lenCol = lengthRaw ? optColor : missingColor;
      lengthDimSvg =
        '<line x1="' + xLeft + '" y1="' + (cy + maxR + 4) + '" x2="' + xLeft + '" y2="' + (dimY + 5) + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
        '<line x1="' + xRight + '" y1="' + (cy + maxR + 4) + '" x2="' + xRight + '" y2="' + (dimY + 5) + '" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 2" />' +
        '<line x1="' + (xLeft + 3) + '" y1="' + dimY + '" x2="' + (xRight - 3) + '" y2="' + dimY + '" stroke="' + lenCol + '" stroke-width="1" />' +
        '<polygon points="' + xLeft + ',' + dimY + ' ' + (xLeft + 6) + ',' + (dimY - 3) + ' ' + (xLeft + 6) + ',' + (dimY + 3) + '" fill="' + lenCol + '" />' +
        '<polygon points="' + xRight + ',' + dimY + ' ' + (xRight - 6) + ',' + (dimY - 3) + ' ' + (xRight - 6) + ',' + (dimY + 3) + '" fill="' + lenCol + '" />' +
        '<text x="190" y="' + (dimY + 16) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + lenCol + '">' + esc(lenLabel) + '</text>';
      infoStartY = dimY + 38;
    }

    const matLabel = material ? ("Material: " + material) : "Material: ?";
    const matCol = material ? reqColor : missingColor;
    const typeDisplay = nippleType || "PLAIN";
    const bothWeldable = !isHex && end1 === "W" && end2 === "W";

    const specs = ["Type: " + typeDisplay];
    if (!bothWeldable) specs.push("Thread: " + (thread || "?"));
    specs.push("Class/Sch: " + (classOrSch || "?"));
    const specLines = wrapLines(specs.join("  |  "), 46);

    const infoSvg =
      '<circle cx="132" cy="' + (infoStartY - 4) + '" r="5" fill="' + dotColor + '" stroke="' + strokeColor + '" stroke-width="1" />' +
      '<text x="142" y="' + infoStartY + '" text-anchor="start" font-size="12" font-weight="700" fill="' + matCol + '">' + esc(matLabel) + '</text>' +
      specLines.map(function (line, i) {
        const y = infoStartY + 18 + i * 16;
        return '<text x="190" y="' + y + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + optColor + '">' + esc(line) + '</text>';
      }).join("");

    const totalHeight = infoStartY + 18 + specLines.length * 16 + 12;

    return (
      '<svg viewBox="0 0 380 ' + totalHeight + '" shape-rendering="geometricPrecision" role="img" aria-label="Pipe nipple technical drawing">' +
        defsSvg +
        '<rect x="0" y="0" width="380" height="' + totalHeight + '" fill="#FFFFFF" />' +
        topSvg +
        '<g class="bolt-shape-animate">' +
          bodySvg +
          centerLineSvg +
          leftEndDetails +
          rightEndDetails +
        '</g>' +
        endLabelsSvg +
        lengthDimSvg +
        infoSvg +
      '</svg>'
    );
  },

  /* Draw the Pipe nipple screen */
  renderScreen: function (container, goBack) {
    const mod = this;

    function makeOptionsHtml(items, placeholderText, includeOther) {
      const opts = placeholderText ? ['<option value="">' + placeholderText + '</option>'] : [];
      items.forEach(function (item) {
        if (item && typeof item === "object") {
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

    container.innerHTML =
      '<div class="item-header card-stagger" style="--card-index: 0;">' +
        '<button type="button" class="back-btn" id="nipple-back-btn" aria-label="Back to Rules">' +
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
            '<button type="button" class="btn-secondary" id="nipple-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="nipple-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="nipple-name-box" class="name-textarea" rows="2" aria-label="SAP Short Text" autocapitalize="characters" spellcheck="false" placeholder="PICK FIELDS BELOW TO BUILD NAME..."></textarea>' +

        '<div class="name-meta-row">' +
          '<span id="nipple-char-counter" class="char-counter">0 / 40</span>' +
          '<p id="nipple-missing-note" class="missing-note"></p>' +
        '</div>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 2;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Long text</h2>' +
          '<div class="name-actions">' +
            '<button type="button" class="btn-secondary" id="nipple-long-rebuild-btn">Rebuild</button>' +
            '<button type="button" class="btn-primary" id="nipple-long-copy-btn">Copy</button>' +
          '</div>' +
        '</div>' +

        '<textarea id="nipple-long-box" class="name-textarea long-textarea" rows="3" aria-label="Long text" placeholder="Pick fields below to build long text..."></textarea>' +
      '</section>' +

      '<section class="card name-card card-stagger" style="--card-index: 3;">' +
        '<div class="name-card-top">' +
          '<h2 class="name-card-title">Drawing</h2>' +
        '</div>' +
        '<div id="nipple-drawing-frame" class="drawing-frame"></div>' +
      '</section>' +

      '<section class="card add-export-card card-stagger" style="--card-index: 4;">' +
        '<button type="button" class="btn-primary add-export-btn" id="nipple-add-export-btn">Add to export list</button>' +
        '<p id="nipple-export-feedback" class="add-export-feedback is-hidden" role="status" aria-live="polite"></p>' +
      '</section>' +

      '<section class="card card-stagger" style="--card-index: 5;">' +
        '<div class="fields-grid">' +
          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nipple-material">Material</label>' +
              '<span class="field-tag is-required">Required</span>' +
            '</div>' +
            '<select id="nipple-material" class="field-control">' +
              makeOptionsHtml(mod.lists.material, "Select material", true) +
            '</select>' +
            '<input id="nipple-material-other" type="text" class="field-control" style="display: none;" placeholder="Type material code" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nipple-type">Type</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="nipple-type" class="field-control">' +
              makeOptionsHtml(mod.lists.type, "None (plain nipple)", true) +
            '</select>' +
            '<input id="nipple-type-other" type="text" class="field-control" style="display: none;" placeholder="Type nipple type" />' +
          '</div>' +

          '<div class="field-group" id="nipple-end1-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nipple-end1">End 1</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="nipple-end1" class="field-control">' +
              makeOptionsHtml(mod.lists.endType, "Select end type", false) +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nipple-size1">Size 1 (inch)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="nipple-size1" class="field-control">' +
              makeOptionsHtml(mod.lists.inchSize, "Select size", true) +
            '</select>' +
            '<input id="nipple-size1-other" type="text" class="field-control" style="display: none;" placeholder="Type size, e.g. 2.1/4" />' +
          '</div>' +

          '<div class="field-group" id="nipple-end2-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nipple-end2">End 2</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="nipple-end2" class="field-control">' +
              makeOptionsHtml(mod.lists.endType, "Select end type", false) +
            '</select>' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nipple-size2">Size 2 (inch)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="nipple-size2" class="field-control">' +
              makeOptionsHtml(mod.lists.inchSize, "Select size", true) +
            '</select>' +
            '<input id="nipple-size2-other" type="text" class="field-control" style="display: none;" placeholder="Type size, e.g. 1/2" />' +
          '</div>' +

          '<div class="field-group" id="nipple-length-group" style="display: none;">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nipple-length">Length (mm)</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<input id="nipple-length" type="number" inputmode="decimal" min="0" step="any" class="field-control" placeholder="e.g. 120" />' +
          '</div>' +

          '<div class="field-group" id="nipple-thread-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nipple-thread">Thread</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="nipple-thread" class="field-control">' +
              makeOptionsHtml(mod.lists.thread, "Select thread", true) +
            '</select>' +
            '<input id="nipple-thread-other" type="text" class="field-control" style="display: none;" placeholder="Type thread, e.g. UNF" />' +
          '</div>' +

          '<div class="field-group">' +
            '<div class="field-label-row">' +
              '<label class="field-label" for="nipple-class-sch">Class or Schedule</label>' +
              '<span class="field-tag is-optional">Optional</span>' +
            '</div>' +
            '<select id="nipple-class-sch" class="field-control">' +
              makeOptionsHtml(mod.lists.classOrSch, "Select class or schedule", true) +
            '</select>' +
            '<input id="nipple-class-sch-other" type="text" class="field-control" style="display: none;" placeholder="e.g. SCH40 or 3000#" />' +
          '</div>' +
        '</div>' +
      '</section>';

    const backBtn = document.getElementById("nipple-back-btn");
    const nameBox = document.getElementById("nipple-name-box");
    const charCounter = document.getElementById("nipple-char-counter");
    const missingNote = document.getElementById("nipple-missing-note");
    const rebuildBtn = document.getElementById("nipple-rebuild-btn");
    const copyBtn = document.getElementById("nipple-copy-btn");
    const longBox = document.getElementById("nipple-long-box");
    const longRebuildBtn = document.getElementById("nipple-long-rebuild-btn");
    const longCopyBtn = document.getElementById("nipple-long-copy-btn");
    const drawingFrame = document.getElementById("nipple-drawing-frame");
    const addExportBtn = document.getElementById("nipple-add-export-btn");
    const exportFeedback = document.getElementById("nipple-export-feedback");

    const end1Group = document.getElementById("nipple-end1-group");
    const end2Group = document.getElementById("nipple-end2-group");
    const lengthGroup = document.getElementById("nipple-length-group");
    const threadGroup = document.getElementById("nipple-thread-group");

    const inputs = {
      material: document.getElementById("nipple-material"),
      materialOther: document.getElementById("nipple-material-other"),
      type: document.getElementById("nipple-type"),
      typeOther: document.getElementById("nipple-type-other"),
      end1: document.getElementById("nipple-end1"),
      size1: document.getElementById("nipple-size1"),
      size1Other: document.getElementById("nipple-size1-other"),
      end2: document.getElementById("nipple-end2"),
      size2: document.getElementById("nipple-size2"),
      size2Other: document.getElementById("nipple-size2-other"),
      length: document.getElementById("nipple-length"),
      thread: document.getElementById("nipple-thread"),
      threadOther: document.getElementById("nipple-thread-other"),
      classOrSch: document.getElementById("nipple-class-sch"),
      classOrSchOther: document.getElementById("nipple-class-sch-other")
    };

    function getResolvedTypeUpper() {
      const raw = inputs.type.value === "__OTHER__" ? inputs.typeOther.value : inputs.type.value;
      return String(raw || "").trim().toUpperCase();
    }

    function syncConditionalControls() {
      const typeUpper = getResolvedTypeUpper();
      const isHex = typeUpper === "HEX";
      const isBarrelOrExt = typeUpper === "BARREL" || typeUpper === "EXTENSION";
      const bothWeldable = !isHex && inputs.end1.value === "W" && inputs.end2.value === "W";

      inputs.materialOther.style.display = inputs.material.value === "__OTHER__" ? "" : "none";
      inputs.typeOther.style.display = inputs.type.value === "__OTHER__" ? "" : "none";
      inputs.size1Other.style.display = inputs.size1.value === "__OTHER__" ? "" : "none";
      inputs.size2Other.style.display = inputs.size2.value === "__OTHER__" ? "" : "none";
      inputs.classOrSchOther.style.display = inputs.classOrSch.value === "__OTHER__" ? "" : "none";

      if (end1Group) end1Group.style.display = isHex ? "none" : "";
      if (end2Group) end2Group.style.display = isHex ? "none" : "";
      if (lengthGroup) lengthGroup.style.display = isBarrelOrExt ? "" : "none";
      if (threadGroup) threadGroup.style.display = bothWeldable ? "none" : "";
      inputs.threadOther.style.display = (!bothWeldable && inputs.thread.value === "__OTHER__") ? "" : "none";
    }

    function readFieldValues() {
      const out = {};
      Object.keys(inputs).forEach(function (k) {
        out[k] = inputs[k].value;
      });
      const typeUpper = getResolvedTypeUpper();
      if (typeUpper !== "BARREL" && typeUpper !== "EXTENSION") {
        out.length = "";
      }
      if (typeUpper === "HEX") {
        out.end1 = "THD";
        out.end2 = "THD";
      } else if (out.end1 === "W" && out.end2 === "W") {
        out.thread = "";
        out.threadOther = "";
      }
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
