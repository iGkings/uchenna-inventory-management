import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from '../components/StatCard/StatCard';
import { Package } from 'lucide-react';

describe('StatCard Component', () => {
  it('renders title, value, and subtitle correctly', () => {
    render(
      <StatCard
        title="Total Products"
        value="1,240"
        subtitle="+12% from last month"
        icon={Package}
      />
    );
    expect(screen.getByText('Total Products')).toBeInTheDocument();
    expect(screen.getByText('1,240')).toBeInTheDocument();
    expect(screen.getByText('+12% from last month')).toBeInTheDocument();
  });
});
