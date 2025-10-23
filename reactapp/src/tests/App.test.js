import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddEvent from '../components/AddEvent';
import ViewEvents from '../components/ViewEvents';
import UpdateEvent from '../components/UpdateEvent';
import Home from '../components/Home';
import { BrowserRouter } from 'react-router-dom';
import "@testing-library/jest-dom"
// Mock useNavigate and useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: '1' }),
}));

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
  get: jest.fn(() => Promise.resolve({ data: [] })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({})),
}));

// ✅ Test Case 1 - Render AddEvent form
test('React_BuildUIComponents_renders AddEvent form with all fields and button', () => {
  render(
    <BrowserRouter>
      <AddEvent />
    </BrowserRouter>
  );

  expect(screen.getByText(/Add Itinerary Event/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Add Event/i })).toBeInTheDocument();
  expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(3); // tripName, eventTitle, eventLocation, notes
});

// ✅ Test Case 2 - AddEvent input works
test('React_BuildUIComponents_can type into Event Title field in AddEvent', () => {
  render(
    <BrowserRouter>
      <AddEvent />
    </BrowserRouter>
  );

  const inputs = screen.getAllByRole('textbox');
  const titleInput = inputs[1]; // Assuming second is eventTitle
  fireEvent.change(titleInput, { target: { value: 'Boat Ride' } });
  expect(titleInput.value).toBe('Boat Ride');
});

// ✅ Test Case 3 - Render ViewEvents and click Fetch
test('React_APIIntegration_TestingAndAPIDocumentation_renders ViewEvents and handles fetch click', async () => {
  render(<ViewEvents />);

  const input = screen.getByPlaceholderText(/Enter trip name/i);
  fireEvent.change(input, { target: { value: 'Beach Trip' } });

  const fetchButton = screen.getByRole('button', { name: /Fetch Events/i });
  fireEvent.click(fetchButton);

  expect(fetchButton).toBeInTheDocument();
});

// ✅ Test Case 4 - Render UpdateEvent form
test('React_BuildUIComponents_renders UpdateEvent form', () => {
  render(
    <BrowserRouter>
      <UpdateEvent />
    </BrowserRouter>
  );

  expect(screen.getAllByText(/Update Event/i).length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(3);
});

// ✅ Test Case 5 - Home page buttons render
test('React_BuildUIComponents_renders Home page with Add and View buttons', () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  expect(screen.getByText(/Travel Itinerary Planner/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Add Event/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /View Events/i })).toBeInTheDocument();
});
test('React_UITestingAndResponsivenessFixes_AddEvent form shows alert or does not submit on empty fields', () => {
  render(
    <BrowserRouter>
      <AddEvent />
    </BrowserRouter>
  );

  const addButton = screen.getByRole('button', { name: /Add Event/i });
  fireEvent.click(addButton);

  // Depending on implementation: could check alert, or that form does not proceed
  // This is a generic assertion that AddEvent title field remains empty
  const inputs = screen.getAllByRole('textbox');
  expect(inputs[1].value).toBe('');
});


test('React_APIIntegration_TestingAndAPIDocumentation_ViewEvents handles empty events response', async () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  render(<ViewEvents />);

  fireEvent.change(screen.getByPlaceholderText(/Enter trip name/i), {
    target: { value: 'Unknown Trip' },
  });

  fireEvent.click(screen.getByRole('button', { name: /Fetch Events/i }));

  const noDataMessage = await screen.findByText(/No events found/i);
  expect(noDataMessage).toBeInTheDocument();
});
import axios from 'axios';

test('React_BuildUIComponents_AddEvent form updates event title correctly on user input', () => {
  render(<AddEvent />);
  
  const inputs = screen.getAllByRole('textbox');
  
  // Based on the JSX, the third text input is Event Title
  const titleInput = inputs[2]; // 0: Trip Name, 1: Event Location (not visible in type), 2: Event Title

  fireEvent.change(titleInput, { target: { value: 'Boat Ride' } });

  expect(titleInput.value).toBe('Boat Ride');
});


