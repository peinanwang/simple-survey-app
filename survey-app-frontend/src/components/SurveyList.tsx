import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { Input, Button } from '@chakra-ui/react';

const SurveyList = () => {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState<string>('');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/survey_requests', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSurveys(data));
  }, [token]);

  return (
    <Box>
      <Box mb={4}>
        <Text mb={2}>You can filter surveys assigned to you by title:</Text>
        <Box mb={2}><Text fontWeight="bold">Survey Title</Text>
          <Input
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Enter title keyword"
          />
        </Box>
        <Button mt={2} onClick={() => {
          fetch(`http://localhost:5000/survey_requests/search?q[title_cont]=${encodeURIComponent(filterValue)}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(data => setSurveys(data))
            .catch(err => alert("Search failed: " + err.message));
        }}>Filter</Button>
      </Box>

      <VStack spacing={4} align="stretch" mt={6}>
      {surveys.map(survey => (
        <Box
          key={survey.id}
          p={4}
          shadow="md"
          borderWidth="1px"
          cursor="pointer"
          onClick={() => navigate(`/surveys/${survey.id}`)}
        >
          <Heading fontSize="xl">{survey.title}</Heading>
          <Text>Status: {survey.status === 'completed' ? 'Complete' : 'Incomplete'}</Text>
        </Box>
      ))}
    </VStack>
    </Box>);
};

export default SurveyList;
