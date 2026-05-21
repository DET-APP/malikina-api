import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type PdfLanguage = 'fr' | 'ar' | 'wo';

interface Verse {
  verse_number: number;
  text_ar?: string;
  text_fr?: string;
  text_wo?: string;
  transliteration?: string;
}

interface XassidaData {
  title: string;
  author_name?: string;
  description?: string;
  verses: Verse[];
}

export function generateXassidaPdf(
  xassida: XassidaData,
  language: PdfLanguage
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
      info: {
        Title: xassida.title,
        Author: xassida.author_name || 'Tariqa Tijaniyya',
        Subject: 'Xassida — Al Moutahabbina Fillahi',
      },
    });

    const chunks: Buffer[] = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const labelMap: Record<PdfLanguage, { verse: string; by: string; source: string }> = {
      fr: { verse: 'Verset', by: 'Par', source: 'Malikina — Al Moutahabbina Fillahi' },
      ar: { verse: 'بيت', by: 'للشيخ', source: 'ملكينا — المتحابين في الله' },
      wo: { verse: 'Bët', by: 'Ci tànk', source: 'Malikina — Yéngeel Tidiaan yi' },
    };
    const labels = labelMap[language];

    // ── Header ────────────────────────────────────────────────────
    doc.fontSize(20).font('Helvetica-Bold')
      .fillColor('#2D5016')
      .text(xassida.title, { align: 'center' });

    if (xassida.author_name) {
      doc.moveDown(0.3)
        .fontSize(13).font('Helvetica')
        .fillColor('#555')
        .text(`${labels.by} ${xassida.author_name}`, { align: 'center' });
    }

    doc.moveDown(0.5)
      .moveTo(60, doc.y).lineTo(535, doc.y)
      .strokeColor('#C9A84C').lineWidth(1.5).stroke();

    doc.moveDown(0.8);

    // ── Description ──────────────────────────────────────────────
    if (xassida.description) {
      doc.fontSize(10).font('Helvetica-Oblique')
        .fillColor('#777')
        .text(xassida.description, { align: 'center' });
      doc.moveDown(1);
    }

    // ── Versets ───────────────────────────────────────────────────
    xassida.verses.forEach((verse, i) => {
      const text = language === 'ar'
        ? verse.text_ar
        : language === 'wo'
          ? (verse.text_wo || verse.text_fr)
          : (verse.text_fr || verse.transliteration);

      if (!text) return;

      // Numéro du verset
      doc.fontSize(8).font('Helvetica')
        .fillColor('#999')
        .text(`${labels.verse} ${verse.verse_number}`, { align: language === 'ar' ? 'right' : 'left' });

      // Texte du verset
      doc.fontSize(12).font('Helvetica')
        .fillColor('#1a1a1a')
        .text(text, {
          align: language === 'ar' ? 'right' : 'left',
          features: language === 'ar' ? ['rtla'] : [],
        });

      // Translitération sous l'arabe si langue arabe
      if (language === 'ar' && verse.transliteration) {
        doc.fontSize(9).font('Helvetica-Oblique')
          .fillColor('#888')
          .text(verse.transliteration, { align: 'left' });
      }

      // Séparateur léger entre versets (pas après le dernier)
      if (i < xassida.verses.length - 1) {
        doc.moveDown(0.3)
          .moveTo(120, doc.y).lineTo(475, doc.y)
          .strokeColor('#e0e0e0').lineWidth(0.5).stroke()
          .moveDown(0.5);
      } else {
        doc.moveDown(0.8);
      }
    });

    // ── Footer ────────────────────────────────────────────────────
    doc.moveTo(60, doc.y).lineTo(535, doc.y)
      .strokeColor('#C9A84C').lineWidth(1).stroke()
      .moveDown(0.5);

    doc.fontSize(9).font('Helvetica').fillColor('#999')
      .text(labels.source, { align: 'center' });

    doc.end();
  });
}
