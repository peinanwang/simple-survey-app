import { Box, Button, Container, Heading, Input, VStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import SurveyList from './components/SurveyList';
import SurveyDetail from './components/SurveyDetail';
import SurveyForm from './components/SurveyForm';

function App() {
  const { user, login, signup, logout } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          alert("Passwords do not match");
          return;
        }
        await signup(name, email, password, confirmPassword);
        setIsSignup(false); // switch to login view after successful signup
      } else {
        await login(email, password);
      }
    } catch (e: any) {
      alert("Failed to login/signup: " + (e?.message || e.toString()));
    }
  };

  return (
    <Container centerContent py={10}>
      {!user ? (
        <Box width="100%" maxW="md" p={6} borderWidth={1} borderRadius="lg">
          <Heading mb={4}>{isSignup ? 'Sign Up' : 'Sign In'}</Heading>
          <VStack>
            {isSignup && (
              <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            )}
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {isSignup && (
              <Input placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            )}
            <Button onClick={handleSubmit} colorScheme="teal" width="full">
              {isSignup ? 'Sign Up' : 'Sign In'}
            </Button>
            <Button variant="ghost" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Have an account? Sign In' : 'New user? Sign Up'}
            </Button>
          </VStack>
        </Box>
      ) : (
        <Box width="100%" maxW="lg">
          <VStack>
            <Text>Welcome, {user.name} ({user.role})</Text>
            <Button onClick={logout} colorScheme="red">Sign Out</Button>
          </VStack>
          <Routes>
            <Route path="/" element={<SurveyList />} />
            <Route path="/surveys/new" element={<SurveyForm />} />
            <Route path="/surveys/:id/edit" element={<SurveyForm />} />
            <Route path="/surveys/:id" element={<SurveyDetail />} />
          </Routes>
        </Box>
      )}
    </Container>
  );
}

export default App;
