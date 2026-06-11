import { useState } from "react"
import { streamJobCoachAsync } from "../services/aiService"
import ReactMarkdown from "react-markdown"

export default function JobCoachPage() {
    const [ question, setQuestion ] = useState('')
    const [response, setResponse] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [conversationId] = useState(() => crypto.randomUUID());

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setResponse('')
        setLoading(true)
        await streamJobCoachAsync(question, conversationId, (chunk) => {
            setResponse(prev => prev + chunk)
        })
        setLoading(false)
    }

    return (
        <div className="container mt-4" style={{ maxWidth: '800px' }}>
            <h2 className="mb-4">Job Coach</h2>
            <form onSubmit={handleSubmit} className="d-flex gap-2">
                <input
                    className="form-control"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Ask something about your job search..."
                    disabled={loading}
                />
                <button className="btn btn-primary" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
                    {loading ? 'Thinking...' : 'Ask'}
                </button>
            </form>
            {response && (
                <div className="mt-4 p-4 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <ReactMarkdown
                        components={{
                            h1: ({children}) => <p style={{ fontWeight: 700, fontSize: '18px', marginBottom: '4px' }}>{children}</p>,
                            h2: ({children}) => <p style={{ fontWeight: 700, fontSize: '17px', marginBottom: '4px' }}>{children}</p>,
                            h3: ({children}) => <p style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>{children}</p>,
                        }}
                    >
                        {response}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    )

}