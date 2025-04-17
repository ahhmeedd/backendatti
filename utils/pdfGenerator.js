// utils/pdfGenerator.js
const PDFDocument = require('pdfkit');

module.exports = {
  generateAdherentsPDF: (adherents) => {
    const doc = new PDFDocument();
    doc.fontSize(20).text('Adherents List', { align: 'center' });
    doc.moveDown();
    
    adherents.forEach((adherent, index) => {
      doc.fontSize(12)
        .text(`${index + 1}. ${adherent.firstName} ${adherent.lastName}`)
        .text(`Email: ${adherent.email}`)
        .text(`Profession: ${adherent.profession}`)
        .moveDown();
    });
    
    return doc;
  }
};