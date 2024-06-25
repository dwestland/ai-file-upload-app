export default function handler(req, res) {
  const requestText = req.body.message
  const apiKey = process.env.OPENAI_API_KEY

  const openaiUrl = 'https://api.openai.com/v1/chat/completions'

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Write a 40 word inspirational message about ${requestText}`,
        },
      ],
      max_tokens: 60,
      temperature: 0.7,
    }),
  }

  async function fetchData() {
    try {
      const response = await fetch(openaiUrl, options)
      if (response.ok) {
        const data = await response.json()
        await res.status(200).json({ name: data.choices[0].message.content })
        console.log('data.choices[0].text ', data.choices[0].message.content)
      } else {
        res.status(response.status).send({ message: 'Error fetching data' })
      }
    } catch (error) {
      res.status(500).send({ message: 'Error fetching data' })
    }
  }

  fetchData()

  console.log('req.body.message ', requestText)
}
