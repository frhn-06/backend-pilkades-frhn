import PDFDocument from 'pdfkit'
import { IResultReport } from '../../types/result.report';




const stylePDF = (doc: PDFKit.PDFDocument, data: IResultReport) => {
    const nameElection = data.election.name;
    const organizerInfo = data.election.organizerInfo;
    const organizerName = data.election.organizerName;
    const awal = data.election.startAt;
    const akhir = data.election.endAt;
    const logo = data.election.logo;
    const status = data.election.status;

    const candidates = data.candidates.map(candid => candid)

    const allVoter = data.summary.countVoters;
    const present = data.summary.countVotersPresent;
    const absen = data.summary.countVotersAbsen;
    const voted = data.summary.countVotersVote;
    const noVoted = data.summary.countVotersNotVote;
    const parcitipant = data.summary.parcitipantsRate;

    const exportAt = data.exportAt;
 
    doc.fontSize(14).text(`Hasil Pemungutan Suara`, {
        align: "center",
    });
    doc.moveDown();
    doc.moveDown();

    doc.fontSize(13).text(`${nameElection}`, {
        align: "center",
    });
    doc.moveDown();
    if(organizerName !== null) {
        doc.fontSize(12).text(`${organizerName}`, {
            align: "center"
        });
    }
    if(organizerInfo !== null) {
        doc.fontSize(10).text(`${organizerInfo}`, {
            align: "center"
        });
    }
   
    doc.moveDown();
    doc.moveDown();

    doc.fontSize(13).font("Times-Roman").text(`Ringkasan Pemungutan Suara`);
    doc.fontSize(12).font("Times-Roman");
    doc.text(`Total Pemilih : ${allVoter} orang`);
    doc.text(`Hadir : ${present} orang`);
    doc.text(`Tidak Hadir : ${absen} orang`);
    doc.text(`Sudah Memilih : ${voted} orang`);
    doc.text(`Hadir Tidak Memilih : ${noVoted} orang`);
    doc.text(`Tingkat Pastisipasi : ${parcitipant} %`);
    
    doc.moveDown();
    
    doc.fontSize(13).font("Times-Roman").text(`Hasil Perolehan Suara`);
    candidates.forEach((candidate, i) => {
        doc.fontSize(12).font("Times-Roman").text(`${i + 1}. ${candidate.members.map((memer) => `${memer.name}`).join(" & ")} = ${candidate.totalVote} suara (${candidate.percentage}%)`)
    });

    doc.moveDown();
    doc.moveDown();

    doc.fontSize(12).font("Times-Roman");
    doc.text("Laporan ini dibuat secara otomatis oleh sistem.");
    doc.text(`Di cetak pada ${exportAt.toLocaleString("id-ID", {dateStyle:'full',timeStyle:"long"})}`);
}


const generateResultPDF = async (data: IResultReport) :Promise<Buffer> => {
    const doc = new PDFDocument();
    
    const chunks : Buffer[] = [];

    return new Promise((resolve, rejects) => {
        doc.on("data", (chunk) => {
            chunks.push(chunk)
        });

        doc.on("end", () => {
            resolve(Buffer.concat(chunks))
        });

        doc.on("error", (error) => {
            rejects(error)
        });


        stylePDF(doc, data);
    

        doc.end();
    }) 
}

export default generateResultPDF;