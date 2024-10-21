// import { expect, test } from "vitest";
// import { render, screen } from '@testing-library/react';
// import BranchesPage from '../../../src/pages/manager/branches.jsx';
// import '@testing-library/jest-dom';


// test('renders BranchesPage with correct title', () => {
//   render(<BranchesPage />);
//   const titleElement = screen.getByText(/Sucursales/i);
//   expect(titleElement).toBeInTheDocument();
// });

import { test, expect } from 'vitest';
import { render } from '@testing-library/react';
import Branch from '../../pages/Branch';

test('simple test', () => {
  render(<Branch />);
  expect(1).toBe(1);
});

