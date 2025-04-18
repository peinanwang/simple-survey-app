import { Box, Button, Heading, Input, Text, VStack } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SurveyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const [survey, setSurvey] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch(`http://localhost:5000/survey_requests/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSurvey(data));
  }, [id, token]);

  if (!survey) return <Text>Loading...</Text>;

  return (
    <Box mt={6}>
      <Button size="sm" mb={4} onClick={() => navigate("/")}>&larr; Back</Button>
      <Heading size="md" mb={4}>{survey.title}</Heading>
      {survey.questions?.length > 0 ? (
        <VStack align="stretch">
          {survey.questions.map((q: any, idx: number) => (
            <Box key={idx}>
              <Text fontWeight="bold">{q.label}</Text>
              <Text fontSize="sm" color="gray.500">{q.info}</Text>
              {survey.status !== 'completed' && (
                <Input
                  placeholder="Your answer..."
                  value={answers[q.label] || ''}
                  onChange={(e) => setAnswers({ ...answers, [q.label]: e.target.value })}
                />
              )}
            </Box>
          ))}
        </VStack>
      ) : (
        <Text>No questions available.</Text>
      )}
      {survey.status !== 'completed' && (
        <Button
          mt={4}
          colorScheme="teal"
          onClick={async () => {
            const unanswered = survey.questions.filter((q: any) => !answers[q.label]);
            if (unanswered.length > 0) {
              alert("Please answer all questions.");
              return;
            }
            try {
              const res = await fetch(`http://localhost:5000/survey_requests/${id}/answer`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ answers })
              });
              if (res.ok) {
                alert("Survey submitted successfully.");
                navigate("/");
              } else {
                alert("Failed to submit survey.");
              }
            } catch (err) {
              alert("Error submitting survey.");
            }
          }}
        >
          Submit
        </Button>
      )}
    </Box>
  );
};

export default SurveyDetail;
