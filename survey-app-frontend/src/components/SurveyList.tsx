import { Box, Heading, Text, VStack, Input, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SurveyList = () => {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState<string>('');
  const [creatorId, setCreatorId] = useState<string>('');
  const [users, setUsers] = useState<any[]>([]);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'user') {
      fetch('http://localhost:5000/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => alert("Failed to load users: " + err.message));
    }

    fetch('http://localhost:5000/survey_requests', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSurveys(data))
      .catch(err => alert("Failed to load surveys: " + err.message));
  }, [token]);

  return (
    <Box>
      {(user?.role === 'admin' || user?.role === 'manager') && (
        <Button colorScheme="teal" mb={4} onClick={() => navigate('/surveys/new')}>
          Create New Survey
        </Button>
      )}
      <Box mb={4}>
        {user?.role === 'user' ? (
          <Text mb={2}>You can filter surveys assigned to you by title:</Text>
        ) : (
          <Text mb={2}>You can filter surveys by title or creator:</Text>
        )}
        <Box mb={2}>
          <Text fontWeight="bold">Survey Title</Text>
          <Input
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Enter title keyword"
          />
        </Box>
        {user?.role !== 'user' && (
          <Box mb={2}>
            <Text fontWeight="bold">Creator</Text>
            <select value={creatorId} onChange={(e) => setCreatorId(e.target.value)}>
              <option value="">All</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{`${user.name} (${user.email})`}</option>
              ))}
            </select>
          </Box>
        )}
        <Button mt={2} onClick={() => {
          const query = new URLSearchParams();
          if (filterValue) query.append('q[title_cont]', filterValue);
          if (creatorId) query.append('q[creator_id_eq]', creatorId);
          fetch(`http://localhost:5000/survey_requests/search?${query.toString()}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(data => setSurveys(data))
            .catch(err => alert("Search failed: " + err.message));
        }}>Filter</Button>
      </Box>

      {surveys.length > 0 ? (
        <VStack align="stretch" mt={6}>
          {surveys.map(survey => (
            <Box key={survey.id} p={4} shadow="md" borderWidth="1px" width="100%">
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" w="100%">
                <Box onClick={() => navigate(`/surveys/${survey.id}`)} cursor="pointer">
                  <Heading fontSize="xl">{survey.title}</Heading>
                  <Text>Status: {survey.status === 'completed' ? 'Complete' : 'Incomplete'}</Text>
                  {survey.assigned_to_id && (
                    <Text fontSize="sm" color="gray.600">Assigned to user ID: {survey.assigned_to_id}</Text>
                  )}
                </Box>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <Box display="flex" flexDirection="column" gap={2} alignItems="flex-end">
                    <Button size="sm" colorScheme="blue" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/surveys/${survey.id}/edit`);
                    }}>Edit</Button>

                    {survey.status === 'new' && (
                      <select
                        onClick={(e) => e.stopPropagation()}
                        onChange={async (e) => {
                          const userId = e.target.value;
                          if (!userId) return;
                          const confirm = window.confirm(`Assign this survey to user ID ${userId}?`);
                          if (!confirm) return;
                          try {
                            const res = await fetch(`http://localhost:5000/survey_requests/${survey.id}/assign_user?user_id=${userId}`, {
                              method: 'PATCH',
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            if (!res.ok) throw new Error('Assignment failed');
                            alert('Survey assigned successfully');
                            setSurveys(prev => prev.map(s => s.id === survey.id ? { ...s, status: 'assigned', assigned_to_id: userId } : s));
                          } catch (err: any) {
                            alert(err.message);
                          }
                        }}
                      >
                        <option value="">Assign to user</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{`${u.name} (${u.email})`}</option>
                        ))}
                      </select>
                    )}

                    <Button size="sm" colorScheme="red" onClick={async (e) => {
                      e.stopPropagation();
                      if (!window.confirm('Are you sure you want to delete this survey?')) return;
                      try {
                        const res = await fetch(`http://localhost:5000/survey_requests/${survey.id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.ok) {
                          setSurveys(surveys.filter(s => s.id !== survey.id));
                        } else {
                          alert('Failed to delete survey.');
                        }
                      } catch (err) {
                        alert('Error deleting survey.');
                      }
                    }}>Delete</Button>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text mt={6}>No surveys found.</Text>
      )}
    </Box>
  );
};

export default SurveyList;
