import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { EcoSpinner, EcoSpinnerMini } from '@/components/ui/eco-spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SpinnerDemo() {
  return (
    <>
      <Header />
      <div className="container py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Eco-Friendly Loading Spinners</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Standard Sizes</CardTitle>
              <CardDescription>
                Available in multiple sizes for different contexts
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-8">
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2">Extra Small (xs)</p>
                <EcoSpinner size="xs" />
              </div>
              
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2">Small (sm)</p>
                <EcoSpinner size="sm" />
              </div>
              
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2">Medium (md) - Default</p>
                <EcoSpinner size="md" />
              </div>
              
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2">Large (lg)</p>
                <EcoSpinner size="lg" />
              </div>
              
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2">Extra Large (xl)</p>
                <EcoSpinner size="xl" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>With Messages</CardTitle>
              <CardDescription>
                Spinners can include contextual messages
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-8">
              <EcoSpinner size="md" message="Loading data..." />
              <EcoSpinner size="md" message="Calculating impact..." />
              <EcoSpinner size="md" message="Processing donation..." />
              <EcoSpinner size="md" message="Updating your profile..." />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Button Integration</CardTitle>
              <CardDescription>
                Mini spinner for use in buttons and inline elements
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Button disabled className="w-40">
                <EcoSpinnerMini className="mr-2" />
                Loading...
              </Button>
              
              <Button variant="outline" disabled className="w-40">
                <EcoSpinnerMini className="mr-2" />
                Submitting
              </Button>
              
              <Button variant="secondary" disabled className="w-40">
                <EcoSpinnerMini className="mr-2" />
                Processing
              </Button>
              
              <Button variant="destructive" disabled className="w-40">
                <EcoSpinnerMini className="mr-2" />
                Cancelling
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Usage Example</CardTitle>
            <CardDescription>
              How to implement the EcoSpinner component in your code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-secondary p-4 rounded-md overflow-x-auto">
              <code>{`// Standard spinner
<EcoSpinner size="md" />

// With custom message
<EcoSpinner size="lg" message="Loading environmental data..." />

// Mini spinner for buttons
<Button disabled>
  <EcoSpinnerMini className="mr-2" />
  Processing
</Button>`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}