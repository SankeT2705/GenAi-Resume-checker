const PDFDocument = require("pdfkit")

/**
 * Generates an ultra-clean, modern, human-crafted ATS-friendly PDF resume buffer
 * @param {Object} data - Perfect resume JSON object
 * @returns {Promise<Buffer>}
 */
function createPerfectResumePdf(data) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 45
      })

      const buffers = []
      doc.on("data", buffers.push.bind(buffers))
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers)
        resolve(pdfBuffer)
      })

      // Elegant Modern Palette
      const primaryColor = "#0f172a" // Slate Dark
      const accentColor = "#2563eb"  // Classic Professional Blue
      const textColor = "#334155"    // Charcoal Text
      const dividerColor = "#e2e8f0" // Soft Line Divider

      // Helper function for Section Headers
      const drawSectionHeader = (title) => {
        doc.moveDown(0.7)
        doc.font("Helvetica-Bold")
           .fontSize(11)
           .fillColor(primaryColor)
           .text(title.toUpperCase(), { characterSpacing: 1.2 })
        
        const y = doc.y + 3
        doc.moveTo(45, y)
           .lineTo(550, y)
           .strokeColor(accentColor)
           .lineWidth(1.25)
           .stroke()
        
        doc.moveDown(0.4)
      }

      // 1. Header (Candidate Name & Contact Details)
      if (data.name) {
        doc.font("Helvetica-Bold")
           .fontSize(20)
           .fillColor(primaryColor)
           .text(data.name.toUpperCase(), { align: "center", characterSpacing: 1 })
      }

      const contactParts = []
      if (data.contact) {
        if (data.contact.email) contactParts.push(data.contact.email)
        if (data.contact.phone) contactParts.push(data.contact.phone)
        if (data.contact.location) contactParts.push(data.contact.location)
        if (data.contact.linkedin) contactParts.push(data.contact.linkedin)
        if (data.contact.github) contactParts.push(data.contact.github)
      }

      if (contactParts.length > 0) {
        doc.moveDown(0.25)
        doc.font("Helvetica")
           .fontSize(8.5)
           .fillColor(textColor)
           .text(contactParts.join("   |   "), { align: "center" })
      }

      // Sub-header Divider
      doc.moveDown(0.5)
      doc.moveTo(45, doc.y)
         .lineTo(550, doc.y)
         .strokeColor(dividerColor)
         .lineWidth(0.75)
         .stroke()

      // 2. Professional Summary
      if (data.professionalSummary) {
        drawSectionHeader("Professional Summary")
        doc.font("Helvetica")
           .fontSize(9.5)
           .fillColor(textColor)
           .text(data.professionalSummary, { align: "justify", lineGap: 2.5 })
      }

      // 3. Technical & Core Skills
      if (data.skills && data.skills.length > 0) {
        drawSectionHeader("Technical & Core Skills")
        data.skills.forEach(skillCat => {
          doc.font("Helvetica-Bold")
             .fontSize(9)
             .fillColor(primaryColor)
             .text(`${skillCat.category}: `, { continued: true })
             .font("Helvetica")
             .fillColor(textColor)
             .text(Array.isArray(skillCat.items) ? skillCat.items.join(", ") : skillCat.items, { lineGap: 2 })
        })
      }

      // 4. Professional Experience
      if (data.experience && data.experience.length > 0) {
        drawSectionHeader("Professional Experience")
        data.experience.forEach(exp => {
          const startY = doc.y
          doc.font("Helvetica-Bold")
             .fontSize(10)
             .fillColor(primaryColor)
             .text(exp.title || "Position", 45, startY, { continued: true })
             .font("Helvetica-Bold")
             .fillColor(accentColor)
             .text(`  —  ${exp.company || ""}`)

          if (exp.dates) {
            doc.font("Helvetica-Oblique")
               .fontSize(9)
               .fillColor(textColor)
               .text(exp.dates, 45, startY, { align: "right" })
          }

          doc.moveDown(0.2)

          if (exp.bulletPoints && exp.bulletPoints.length > 0) {
            exp.bulletPoints.forEach(bp => {
              doc.font("Helvetica")
                 .fontSize(9)
                 .fillColor(textColor)
                 .text(`•  ${bp}`, { indent: 8, lineGap: 2, align: "justify" })
            })
          }
          doc.moveDown(0.4)
        })
      }

      // 5. Featured Projects
      if (data.projects && data.projects.length > 0) {
        drawSectionHeader("Featured Projects")
        data.projects.forEach(proj => {
          const startY = doc.y
          doc.font("Helvetica-Bold")
             .fontSize(9.5)
             .fillColor(primaryColor)
             .text(proj.title || "Project", 45, startY, { continued: proj.techStack ? true : false })

          if (proj.techStack) {
            doc.font("Helvetica-Oblique")
               .fontSize(8.5)
               .fillColor(accentColor)
               .text(` (${proj.techStack})`)
          }

          doc.moveDown(0.2)
          if (proj.bulletPoints && proj.bulletPoints.length > 0) {
            proj.bulletPoints.forEach(bp => {
              doc.font("Helvetica")
                 .fontSize(9)
                 .fillColor(textColor)
                 .text(`•  ${bp}`, { indent: 8, lineGap: 2, align: "justify" })
            })
          }
          doc.moveDown(0.4)
        })
      }

      // 6. Education
      if (data.education && data.education.length > 0) {
        drawSectionHeader("Education")
        data.education.forEach(edu => {
          const startY = doc.y
          doc.font("Helvetica-Bold")
             .fontSize(9.5)
             .fillColor(primaryColor)
             .text(edu.degree || "Degree", 45, startY, { continued: edu.institution ? true : false })

          if (edu.institution) {
            doc.font("Helvetica")
               .fillColor(textColor)
               .text(`  —  ${edu.institution}`)
          }

          if (edu.dates) {
            doc.font("Helvetica-Oblique")
               .fontSize(8.5)
               .fillColor(textColor)
               .text(edu.dates, 45, startY, { align: "right" })
          }
          doc.moveDown(0.2)
        })
      }

      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  createPerfectResumePdf
}
