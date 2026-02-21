class PdfGenerator
  def self.generate(html, options = {})
    WickedPdf.new.pdf_from_string(
      wrap_in_layout(html),
      page_size: "A4",
      margin: { top: 20, bottom: 20, left: 20, right: 20 },
      **options
    )
  end

  private_class_method def self.wrap_in_layout(html)
    <<~HTML
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>#{html}</body>
      </html>
    HTML
  end
end
