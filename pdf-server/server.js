const express = require('express');
const bodyParser = require('body-parser');
const pdfMakePrinter = require('pdfmake');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// PDF 생성 API
app.post('/generate-pdf', (req, res) => {
    const body = req.body;

    // 📌 productGroup별로 그룹핑
    const groupMap = {};
    body.tableData.forEach(item => {
        const group = item.productGroup || '주요';  // 없는 경우 "기타"로 처리
        if (!groupMap[group]) {
            groupMap[group] = [];
        }
        groupMap[group].push(item);
    });

    // 📌 content 구성
    const pdfContent = [
        { text: body.title || 'Default Title', fontSize: 22, bold: true, margin: [0, 0, 0, 20] },
        { text: body.content || 'No content provided.', fontSize: 14, margin: [0, 0, 0, 20] }
    ];

    // 📌 productGroup별 table 추가
    Object.keys(groupMap).forEach(group => {
        pdfContent.push(
            { text: `${group} 제품군`, fontSize: 10, bold: true, margin: [0, 10, 0, 8] },
            {
                table: {
                    widths: ['*', '*', '*', '*'],  // ✅ 반드시 4개로!
                    body: [
                        // 헤더
                        [
                            { text: '제품명', style: 'tableHeader' },
                            { text: '매출액', style: 'tableHeader' },
                            { text: '공헌이익(금액)', style: 'tableHeader' },
                            { text: '공헌이익률', style: 'tableHeader' }
                        ],
                        // 데이터
                        ...groupMap[group].map(item => [
                            { text: item.productName },
                            { text: item.sales, alignment: 'center' },  // 매출액 가운데
                            { text: item.contributionAmount, alignment: 'center' },  // 공헌이익(금액) 가운데
                            { text: item.contributionRate, alignment: 'center' }  // 공헌이익률 가운데
                        ])

                    ]
                },
                layout: 'lightHorizontalLines'
            }
        );
    });

    // 📌 문서 정의
    const docDefinition = {
        defaultStyle: {
            font: 'NotoSansKR'
        },
        content: pdfContent,
        styles: {
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black',
                fillColor: '#eeeeee',
                alignment: 'center'
            }
        }
    };

    // 📌 PDF 생성
    const printer = new pdfMakePrinter({
        NotoSansKR: {
            normal: 'fonts/NotoSansKR-Regular.ttf',
            bold: 'fonts/NotoSansKR-Bold.ttf',
            italics: 'fonts/NotoSansKR-Regular.ttf',
            bolditalics: 'fonts/NotoSansKR-Bold.ttf'
        }
    });

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');

    pdfDoc.pipe(res);
    pdfDoc.end();
});

app.listen(3000, () => {
    console.log('✅ PDF server running on http://localhost:3000');
});
