import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Report, ReportService } from '~/lib/ReportService';
import { OpenAIService, OpenAIMessage } from '~/lib/OpenAIService';

const handleChat = async (content: string) :Promise<string> => {
  const messages: OpenAIMessage[] = [
    { role: 'user', content },
  ];

  try {
    const response = await OpenAIService.sendMessage({ messages });
    return response.choices[0].message.content;
  } catch (error) {
    return "error";
  }
};
export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Report | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summarize, setSummarize] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    refreshReports();
  }, []);

  const refreshReports = () => {
    const all = ReportService.list();
    setReports(search ? all.filter((r : Report) => r.title.toLowerCase().includes(search.toLowerCase())) : all);
  };

  const handleEdit = (report: Report) => {
    setEditing(report);
    setTitle(report.title);
    setContent(report.content);
    setOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setTitle('');
    setContent('');
    setOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      ReportService.update(editing.id, title, content);
    } else {
      ReportService.create(title, content);
    }
    setOpen(false);
    refreshReports();
  };

  const handleChat = async () :Promise<string> => {
    const messages: OpenAIMessage[] = [
      { role: 'user', content },
    ];
  
    try {
      const response = await OpenAIService.sendMessage({ messages });
      return response.choices[0].message.content;
    } catch (error) {
      return "error";
    }
  };

  const handleGenerateDraft = async () => {
    const prompt = ('Enter a prompt for the AI to generate a report draft:');
    if (!prompt) return;
    setLoadingAI(true);
    try {
      const result = await handleChat();
      setSummarize(result);
    } catch (err) {
      alert('Failed to generate draft.');
    }
    setLoadingAI(false);
  };

  const handleSummarizeContent = async () => {
    if (!content.trim()) return alert('Content is empty!');
    setLoadingAI(true);
    try {
      const result = await handleChat();
      setSummarize(result);
    } catch (err) {
      alert('Failed to summarize content.');
    }
    setLoadingAI(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Search by title"
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setReports(ReportService.search(e.target.value));
          }}
        />
        <Button variant="contained" onClick={handleCreate}>
          New Report
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Updated</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.title}</TableCell>
              <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
              <TableCell>{new Date(report.updatedAt).toLocaleString()}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(report)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editing ? 'Edit Report' : 'New Report'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

<TextField
            fullWidth
            label=""
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          {summarize}
          <Box
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setContent(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: content }}
            sx={{
              border: '1px solid #ccc',
              borderRadius: 1,
              padding: 2,
              minHeight: '150px',
              outline: 'none',
              backgroundColor: loadingAI ? '#f9f9f9' : 'white',
            }}
          />
          <Box display="flex" gap={2} mt={2}>
            <Button onClick={handleGenerateDraft} variant="outlined" disabled={loadingAI}>
              {loadingAI ? 'Generating...' : 'Generate Draft (AI)'}
            </Button>
            <Button onClick={handleSummarizeContent} variant="outlined" disabled={loadingAI}>
              {loadingAI ? 'Summarizing...' : 'Summarize Content (AI)'}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={loadingAI}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

