import fs from 'fs'
import PDFDocument from 'pdfkit'

export const pdfService = {
	buildBugsPDF,
}

function buildBugsPDF(res, bugs, filename = 'SaveTheBugs.pdf') {
	const doc = new PDFDocument()

	res.setHeader('Content-Type', 'application/pdf')
	res.setHeader('Content-Disposition', 'attachment; filename="Bugs.pdf"')

	// Pipe its output somewhere, like to a file or HTTP response
	doc.pipe(res)

	// iterate bugs array, and create a pdf with all the bugs
	bugs.forEach((bug) => {
		// doc.font('./fonts/roboto.ttf')
		doc.text(`Bug ID: ${bug._id}`)
		doc.text(`Title: ${bug.title}`)
		doc.text(`Description: ${bug.description}`)
		doc.text(`Severity: ${bug.severity}`)
		doc.addPage()
	})

	// finalize PDF file
	doc.end()
}
