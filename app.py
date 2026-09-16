from flask import Flask, request, send_file
from flask_cors import CORS
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
import io
import datetime

app = Flask(__name__)
CORS(app)

@app.route('/api/export-stock', methods=['POST'])
def export_stock():
    data = request.json
    medications = data.get('medications', [])
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    
    styles = getSampleStyleSheet()
    title = Paragraph("<b>MDLIS - Stock Audit Report</b>", styles['Title'])
    date_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    subtitle = Paragraph(f"Generated on: {date_str}", styles['Normal'])
    
    elements.append(title)
    elements.append(subtitle)
    elements.append(Spacer(1, 20))
    
    # Table Data
    table_data = [['ID', 'Name', 'Strength', 'Batch', 'Quantity', 'Status']]
    for m in medications:
        table_data.append([
            m.get('id', ''),
            m.get('name', ''),
            m.get('strength', ''),
            m.get('batch', ''),
            str(m.get('quantity', 0)),
            m.get('status', '')
        ])
        
    t = Table(table_data, colWidths=[70, 150, 70, 70, 60, 80])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 10),
        ('BOTTOMPADDING', (0,0), (-1,0), 12),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#F8FAFC')),
        ('TEXTCOLOR', (0,1), (-1,-1), colors.HexColor('#0F172A')),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0'))
    ]))
    
    elements.append(t)
    doc.build(elements)
    
    buffer.seek(0)
    return send_file(
        buffer,
        as_attachment=True,
        download_name='stock_audit_report.pdf',
        mimetype='application/pdf'
    )

if __name__ == '__main__':
    app.run(port=5000)
