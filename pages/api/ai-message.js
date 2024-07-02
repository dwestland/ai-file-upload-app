// pages/api/ai-message.js
import multer from 'multer'
import { parse } from 'csv-parse'
import pdf from 'pdf-parse'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

const upload = multer({ dest: '/tmp' })

export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY
  const openaiUrl = 'https://api.openai.com/v1/chat/completions'

  const uploadMiddleware = upload.single('file')

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload error' })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    let fileContent = ''

    if (req.file.mimetype === 'text/csv') {
      const csvData = fs.readFileSync(req.file.path, 'utf8')
      const records = parse(csvData, { columns: true })
      fileContent = JSON.stringify(records, null, 2)
    } else if (req.file.mimetype === 'application/pdf') {
      const pdfData = await pdf(fs.readFileSync(req.file.path))
      fileContent = pdfData.text
    } else {
      return res.status(400).json({ message: 'Unsupported file type' })
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `You are an expert real estate professional that contacts potential clients by email.

Take the accompanying  CSV file and for each of the first 3 rows create the following:

Make a bullet point list of the 1st Owner's First Name, 1st Owner’s Last Name, Site City, Purchase Price (use dollar sign and commas), Legal Description, Email and if there is no entry for the field, indicate it with a "N/A"

--- 

After the bullet point list, compose an email, like this(If there is no "1st Owner’s First Name", the first line should read "Dear Home Owner" and if there is no "Site Address" the email body should read "I think your property is great and I think I can sell it within 3 days. Let's connect, call me at 310-912-4600." ):

Dear[1st Owner's First Name],

I think your property is great at [Site Address] and I think I can sell it within 3 days. Let's connect, call me at 310-912-4600.

Keep it cool...

Dylan Westland\n\n${fileContent}`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    }

    try {
      const response = await fetch(openaiUrl, options)
      if (response.ok) {
        const data = await response.json()
        res.status(200).json({ name: data.choices[0].message.content })
        // eslint-disable-next-line no-console
        console.log(
          'data.choices[0].message.content ',
          data.choices[0].message.content
        )
      } else {
        res.status(response.status).json({ message: 'Error fetching data' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data' })
    } finally {
      // Clean up the temporary file
      fs.unlinkSync(req.file.path)
    }
    return null
  })
}
