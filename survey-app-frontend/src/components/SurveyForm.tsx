import { Box, Button, Heading, Input, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const SurveyForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ label: '', info: '' }]);

  useEffect(() => {
    if (isEditMode) {
      fetch(`http://localhost:5000/survey_requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setTitle(data.title);
          setDescription(data.description);
          setQuestions(data.questions || [{ label: '', info: '' }]);
        })
        .catch(err => alert('Failed to load survey: ' + err.message));
    }
  }, [id, isEditMode, token]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { label: '', info: '' }]);
  };

  const handleSubmit = async () => {
    if (!title || !description || questions.length === 0 || questions.some(q => !q.label || !q.info)) {
      alert('Please fill in all fields. Title, description, and at least one complete question are required.');
      return;
    }

    const payload = {
      survey_request: {
        title,
        description,
        questions: questions.map(q => ({ ...q, data_type: 'string' }))
      }
    };

    try {
      const res = await fetch(`http://localhost:5000/survey_requests${isEditMode ? `/${id}` : ''}`, {
        method: isEditMode ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(isEditMode ? 'Failed to update survey' : 'Failed to create survey');

      alert(isEditMode ? 'Survey updated successfully' : 'Survey created successfully');
      navigate('/');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Box mt={6}>
      <Heading mb={4}>{isEditMode ? 'Edit Survey' : 'Create New Survey'}</Heading>
      <VStack align="stretch">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Heading size="sm">Questions</Heading>
        {questions.map((q, idx) => (
          <Box key={idx} borderWidth="1px" borderRadius="md" p={3} mb={2}>
            <Input
              mb={2}
              placeholder="Question Label"
              value={q.label}
              onChange={(e) => {
                const copy = [...questions];
                copy[idx].label = e.target.value;
                setQuestions(copy);
              }}
            />
            <Input
              placeholder="Additional Info"
              value={q.info}
              onChange={(e) => {
                const copy = [...questions];
                copy[idx].info = e.target.value;
                setQuestions(copy);
              }}
            />
            <Button size="sm" colorScheme="red" mt={2} onClick={() => {
              const updated = questions.filter((_, i) => i !== idx);
              setQuestions(updated);
            }}>Delete Question</Button>

          </Box>
        ))}
        <Button onClick={handleAddQuestion}>Add Question</Button>
        <Button colorScheme="teal" onClick={handleSubmit}>{isEditMode ? 'Update Survey' : 'Create a Survey'}</Button>
      </VStack>
    </Box>
  );
};

export default SurveyForm;
