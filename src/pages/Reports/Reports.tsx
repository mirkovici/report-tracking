import React, { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
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
  CircularProgress,
  Stack,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Report, ReportService } from '~/lib/ReportService';
import { OpenAIService, OpenAIMessage } from '~/lib/OpenAIService';
import { useReportStore } from '~/stores/reportStore';

function SortableRow({ report, onEdit }: { report: Report; onEdit: (r: Report) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: report.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners} hover>
      <TableCell>{report.title}</TableCell>
      <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
      <TableCell>{new Date(report.updatedAt).toLocaleString()}</TableCell>
      <TableCell align="center">
        <IconButton onClick={() => onEdit(report)}>
          <EditIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default function Reports() {
  const reports = useReportStore((s) => s.reports);
  const setReports = useReportStore((s) => s.setReports);
  const search = useReportStore((s) => s.search);
  const setSearch = useReportStore((s) => s.setSearch);
  const filter = useReportStore((s) => s.filter);
  const setFilter = useReportStore((s) => s.setFilter);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Report | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [summarize, setSummarize] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    refreshReports();
  }, [search, filter]);

  const refreshReports = () => {
    let all = ReportService.list();
    if (search) {
      all = all.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (filter !== 'all') {
      all = all.filter((r) => r.title.toLowerCase().includes(filter));
    }
    setReports(all);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = reports.findIndex((r) => r.id === active.id);
      const newIndex = reports.findIndex((r) => r.id === over.id);
      setReports((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleEdit = (report: Report) => {
    setEditing(report);
    setTitle(report.title);
    setContent(report.content);
    setPrompt('');
    setSummarize('');
    setOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setTitle('');
    setContent('');
    setPrompt('');
    setSummarize('');
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

  const handleGenerateDraft = async () => {
    if (!prompt.trim()) return alert('Please enter a prompt to generate a draft.');
    setLoadingAI(true);
    try {
      const messages: OpenAIMessage[] = [{ role: 'user', content: prompt }];
      const response = await OpenAIService.sendMessage({ messages });
      setContent(response.choices[0].message.content);
      setSummarize('');
    } catch {
      alert('Failed to generate draft.');
    }
    setLoadingAI(false);
  };

  const handleSummarizeContent = async () => {
    if (!content.trim()) return alert('Content is empty!');
    setLoadingAI(true);
    try {
      const messages: OpenAIMessage[] = [{ role: 'user', content: `Summarize this: ${content}` }];
      const response = await OpenAIService.sendMessage({ messages });
      setSummarize(response.choices[0].message.content);
    } catch {
      alert('Failed to summarize content.');
    }
    setLoadingAI(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Reports</Typography>
        <Button variant="contained" onClick={handleCreate}>New Report</Button>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <TextField
          fullWidth
          label="Search by title"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            label="Filter"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="summary">Summary</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Paper elevation={2}>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={reports.map(r => r.id)} strategy={verticalListSortingStrategy}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Created</strong></TableCell>
                  <TableCell><strong>Updated</strong></TableCell>
                  <TableCell align="center"><strong>Edit</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <SortableRow key={report.id} report={report} onEdit={handleEdit} />
                ))}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editing ? 'Edit Report' : 'New Report'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <TextField
              fullWidth
              label="Prompt (for AI Draft)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              helperText="Describe what kind of report you'd like to generate"
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>Content</Typography>
              <Box position="relative">
                <Editor
                  apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                  onInit={(evt: any, editor: any) => {
                    editorRef.current = editor;
                    setEditorLoaded(true);
                  }}
                  value={content}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: ['link', 'lists', 'autolink', 'preview'],
                    toolbar:
                      'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link',
                  }}
                  onEditorChange={(newValue: React.SetStateAction<string>) => setContent(newValue)}
                />
                {!editorLoaded && (
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    bgcolor="rgba(255,255,255,0.6)"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    zIndex={10}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </Box>
            </Box>

            {summarize && (
              <Box sx={{ mt: 2, p: 2, border: '1px dashed #888', borderRadius: 1, backgroundColor: '#fafafa' }}>
                <Typography variant="subtitle2">AI Summary:</Typography>
                <Typography variant="body2">{summarize}</Typography>
              </Box>
            )}

            <Stack direction="row" spacing={2}>
              <Button onClick={handleGenerateDraft} variant="outlined" disabled={loadingAI}>
                {loadingAI ? <CircularProgress size={20} /> : 'Generate Draft (AI)'}
              </Button>
              <Button onClick={handleSummarizeContent} variant="outlined" disabled={loadingAI}>
                {loadingAI ? <CircularProgress size={20} /> : 'Summarize Content (AI)'}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={loadingAI}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
