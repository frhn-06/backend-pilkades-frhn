// import PDFDocument from 'pdfkit'
// import { IResultReport } from '../../types/result.report';
// import convert from '../convert';




// const stylePDF = (doc: PDFKit.PDFDocument, data: IResultReport) => {
//     const nameElection = data.election.name;
//     const organizerInfo = data.election.organizerInfo;
//     const organizerName = data.election.organizerName;
//     const awal = data.election.startAt;
//     const logo = data.election.logo;  // ini berkemungkinan "string" | null

//     const candidates = data.candidates.map(candid => candid)

//     const allVoter = data.summary.countVoters;
//     const present = data.summary.countVotersPresent;
//     const absen = data.summary.countVotersAbsen;
//     const voted = data.summary.countVotersVote;
//     const noVoted = data.summary.countVotersNotVote;
//     const parcitipant = data.summary.parcitipantsRate;

//     const exportAt = data.exportAt;
 
//     doc.fontSize(14).text(`Hasil Pemungutan Suara`, {
//         align: "center",
//     });
//     doc.moveDown();
//     doc.moveDown();

//     doc.fontSize(13).text(`${nameElection}`, {
//         align: "center",
//     });
//     doc.moveDown();
//     if(organizerName !== null) {
//         doc.fontSize(12).text(`${organizerName}`, {
//             align: "center"
//         });
//     }
//     if(organizerInfo !== null) {
//         doc.fontSize(10).text(`${organizerInfo}`, {
//             align: "center"
//         });
//     }
//     doc.moveDown()
//     doc.fontSize(10).text(`${convert.FormatTimetoLocalJustDate(awal)}`, {
//         align: "right"
//     })
   
//     doc.moveDown();
//     doc.moveDown();

//     doc.fontSize(13).font("Times-Roman").text(`Ringkasan Pemungutan Suara`);
//     doc.fontSize(12).font("Times-Roman");
//     doc.text(`Total Pemilih : ${allVoter} orang`);
//     doc.text(`Hadir : ${present} orang`);
//     doc.text(`Tidak Hadir : ${absen} orang`);
//     doc.text(`Sudah Memilih : ${voted} orang`);
//     doc.text(`Hadir Tidak Memilih : ${noVoted} orang`);
//     doc.text(`Tingkat Pastisipasi : ${parcitipant} %`);
    
//     doc.moveDown();
    
//     doc.fontSize(13).font("Times-Roman").text(`Hasil Perolehan Suara`);
//     candidates.forEach((candidate, i) => {
//         doc.fontSize(12).font("Times-Roman").text(`${i + 1}. ${candidate.members.map((memer) => `${memer.name}`).join(" & ")} = ${candidate.totalVote} suara (${candidate.percentage}%)`)
//     });

//     doc.moveDown();
//     doc.moveDown();

//     doc.fontSize(12).font("Times-Roman");
//     doc.text("Laporan ini dibuat secara otomatis oleh sistem.");
//     doc.text(`Di cetak pada ${convert.FormatTimeToLocalFull(exportAt)}`);
// }


// const generateResultPDF = async (data: IResultReport) :Promise<Buffer> => {
//     const doc = new PDFDocument();
    
//     const chunks : Buffer[] = [];

//     return new Promise((resolve, rejects) => {
//         doc.on("data", (chunk) => {
//             chunks.push(chunk)
//         });

//         doc.on("end", () => {
//             resolve(Buffer.concat(chunks))
//         });

//         doc.on("error", (error) => {
//             rejects(error)
//         });


//         stylePDF(doc, data);
    

//         doc.end();
//     }) 
// }

// export default generateResultPDF;









import PDFDocument from "pdfkit";
import { IResultReport } from "../../types/result.report";
import convert from "../convert";

const stylePDF = async (doc: PDFKit.PDFDocument, data: IResultReport) => {
    const {
        election,
        candidates,
        summary,
        exportAt,
    } = data;

    const PAGE_WIDTH = 595;
    const MARGIN = 50;
    const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

    const colors = {
        primary: "#333333",
        text: "#222222",
        muted: "#666666",
        border: "#D9D9D9",
        light: "#F5F5F5",
    };

    /*
    |--------------------------------------------------------------------------
    | Helper
    |--------------------------------------------------------------------------
    */

    const drawLine = (y: number) => {
        doc
            .strokeColor(colors.border)
            .lineWidth(0.8)
            .moveTo(MARGIN, y)
            .lineTo(PAGE_WIDTH - MARGIN, y)
            .stroke();
    };

    const sectionTitle = (title: string) => {
        doc
            .font("Helvetica-Bold")
            .fontSize(12)
            .fillColor(colors.text)
            .text(title);

        doc.moveDown(0.4);
    };

    const summaryBox = (
        x: number,
        y: number,
        width: number,
        label: string,
        value: string
    ) => {
        const height = 55;

        doc
            .roundedRect(x, y, width, height, 6)
            .fillColor(colors.light)
            .fill();

        doc
            .font("Helvetica")
            .fontSize(8)
            .fillColor(colors.muted)
            .text(label, x + 10, y + 10);

        doc
            .font("Helvetica-Bold")
            .fontSize(15)
            .fillColor(colors.text)
            .text(value, x + 10, y + 27);
    };

    /*
    |--------------------------------------------------------------------------
    | Header
    |--------------------------------------------------------------------------
    */

    // Garis atas
    doc
        .rect(0, 0, PAGE_WIDTH, 7)
        .fillColor(colors.primary)
        .fill();

    let headerY = MARGIN;

    /*
    |--------------------------------------------------------------------------
    | Logo
    |--------------------------------------------------------------------------
    */

    if (election.logo) {
        try {
            const response = await fetch(election.logo);

            if (response.ok) {
                const buffer = Buffer.from(
                    await response.arrayBuffer()
                );

                doc.image(buffer, MARGIN, headerY, {
                    fit: [55, 55],
                });
            }
        } catch {
            // Jika logo gagal diambil, PDF tetap dibuat
        }
    }

    const titleX = election.logo
        ? MARGIN + 70
        : MARGIN;

    doc
        .font("Helvetica-Bold")
        .fontSize(18)
        .fillColor(colors.text)
        .text(
            "HASIL PEMUNGUTAN SUARA",
            titleX,
            headerY + 5,
            {
                width: CONTENT_WIDTH - 70,
            }
        );

    doc
        .font("Helvetica-Bold")
        .fontSize(13)
        .fillColor(colors.primary)
        .text(
            election.name,
            titleX,
            headerY + 30,
            {
                width: CONTENT_WIDTH - 70,
            }
        );

    if (election.organizerName) {
        doc
            .font("Helvetica")
            .fontSize(8)
            .fillColor(colors.muted)
            .text(
                election.organizerName,
                titleX,
                headerY + 48
            );
    }

    doc.y = headerY + 75;

    drawLine(doc.y);

    doc.moveDown(1);

    /*
    |--------------------------------------------------------------------------
    | Informasi Pemilihan
    |--------------------------------------------------------------------------
    */

    sectionTitle("Informasi Pemilihan");

    const infoY = doc.y;

    const info = [
        ["Nama Pemilihan", election.name],
        [
            "Penyelenggara",
            election.organizerName ?? "-",
        ],
        [
            "Informasi",
            election.organizerInfo ?? "-",
        ],
        [
            "Tanggal",
            convert.FormatTimetoLocalJustDate(
                election.startAt
            ),
        ],
    ];

    info.forEach(([label, value], index) => {
        const y = infoY + index * 18;

        if(typeof label === "string") {
            doc
                .font("Helvetica")
                .fontSize(9)
                .fillColor(colors.muted)
                .text(label, MARGIN, y, {
                    width: 110,
                });
        }

        if(typeof value === "string") {
            doc
                .font("Helvetica-Bold")
                .fontSize(9)
                .fillColor(colors.text)
                .text(value, MARGIN + 120, y, {
                    width: CONTENT_WIDTH - 120,
                });
        }
    });

    doc.y = infoY + info.length * 18 + 15;

    /*
    |--------------------------------------------------------------------------
    | Ringkasan
    |--------------------------------------------------------------------------
    */

    sectionTitle("Ringkasan Pemungutan Suara");

    const gap = 8;

    const boxWidth =
        (CONTENT_WIDTH - gap * 2) / 3;

    const summaryY = doc.y;

    summaryBox(
        MARGIN,
        summaryY,
        boxWidth,
        "TOTAL PEMILIH",
        `${summary.countVoters}`
    );

    summaryBox(
        MARGIN + boxWidth + gap,
        summaryY,
        boxWidth,
        "HADIR",
        `${summary.countVotersPresent}`
    );

    summaryBox(
        MARGIN + (boxWidth + gap) * 2,
        summaryY,
        boxWidth,
        "TIDAK HADIR",
        `${summary.countVotersAbsen}`
    );

    const secondY = summaryY + 65;

    summaryBox(
        MARGIN,
        secondY,
        boxWidth,
        "SUDAH MEMILIH",
        `${summary.countVotersVote}`
    );

    summaryBox(
        MARGIN + boxWidth + gap,
        secondY,
        boxWidth,
        "BELUM MEMILIH",
        `${summary.countVotersNotVote}`
    );

    summaryBox(
        MARGIN + (boxWidth + gap) * 2,
        secondY,
        boxWidth,
        "TINGKAT PARTISIPASI",
        `${summary.parcitipantsRate}%`
    );

    doc.y = secondY + 75;

    /*
    |--------------------------------------------------------------------------
    | Hasil Perolehan Suara
    |--------------------------------------------------------------------------
    */

    sectionTitle("Hasil Perolehan Suara");

    const tableY = doc.y;

    const noWidth = 40;
    const candidateWidth = 280;
    const voteWidth = 80;
    const percentageWidth =
        CONTENT_WIDTH -
        noWidth -
        candidateWidth -
        voteWidth;

    const rowHeight = 30;

    /*
    |--------------------------------------------------------------------------
    | Table Header
    |--------------------------------------------------------------------------
    */

    doc
        .rect(MARGIN, tableY, CONTENT_WIDTH, rowHeight)
        .fillColor(colors.primary)
        .fill();

    doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#FFFFFF");

    doc.text(
        "No.",
        MARGIN + 8,
        tableY + 10,
        {
            width: noWidth,
        }
    );

    doc.text(
        "Kandidat",
        MARGIN + noWidth,
        tableY + 10,
        {
            width: candidateWidth,
        }
    );

    doc.text(
        "Suara",
        MARGIN + noWidth + candidateWidth,
        tableY + 10,
        {
            width: voteWidth - 8,
            align: "right",
        }
    );

    doc.text(
        "Persentase",
        MARGIN +
            noWidth +
            candidateWidth +
            voteWidth,
        tableY + 10,
        {
            width: percentageWidth - 8,
            align: "right",
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Table Rows
    |--------------------------------------------------------------------------
    */

    let currentY = tableY + rowHeight;

    candidates.forEach((candidate, index) => {
        const names = candidate.members
            .map((member) => member.name)
            .join(" & ");

        const background =
            index % 2 === 0
                ? "#FFFFFF"
                : "#F7F7F7";

        doc
            .rect(
                MARGIN,
                currentY,
                CONTENT_WIDTH,
                rowHeight
            )
            .fillColor(background)
            .fill();

        doc
            .font("Helvetica")
            .fontSize(8)
            .fillColor(colors.text);

        doc.text(
            `${index + 1}`,
            MARGIN + 8,
            currentY + 10,
            {
                width: noWidth,
            }
        );

        doc.text(
            names,
            MARGIN + noWidth,
            currentY + 10,
            {
                width: candidateWidth,
            }
        );

        doc.text(
            `${candidate.totalVote}`,
            MARGIN +
                noWidth +
                candidateWidth,
            currentY + 10,
            {
                width: voteWidth - 8,
                align: "right",
            }
        );

        doc.text(
            `${candidate.percentage}%`,
            MARGIN +
                noWidth +
                candidateWidth +
                voteWidth,
            currentY + 10,
            {
                width: percentageWidth - 8,
                align: "right",
            }
        );

        drawLine(currentY + rowHeight);

        currentY += rowHeight;
    });

    /*
    |--------------------------------------------------------------------------
    | Footer
    |--------------------------------------------------------------------------
    */

    doc.moveDown(4);

    doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(colors.muted)
        .text(
            "Laporan ini dibuat secara otomatis oleh VoteDesk Election Management System."
        );

    doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(colors.muted)
        .text(
            `Dicetak pada ${convert.FormatTimeToLocalFull(
                exportAt
            )}`
        );
};










const generateResultPDF = async (data: IResultReport): Promise<Buffer> => {
    const doc = new PDFDocument({
        size: "A4",
        margin: 50,
    });

    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
        doc.on("data", (chunk) => {
            chunks.push(chunk);
        });

        doc.on("end", () => {
            resolve(Buffer.concat(chunks));
        });

        doc.on("error", (error) => {
            reject(error);
        });

        stylePDF(doc, data)
            .then(() => {
                doc.end();
            })
            .catch(reject);
    });
};

export default generateResultPDF;