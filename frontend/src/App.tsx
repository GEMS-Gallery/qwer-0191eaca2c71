import React, { useState } from 'react';
import { Button, Paper, Grid, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const CalculatorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: 'auto',
  maxWidth: 300,
  backgroundColor: '#FFFFFF',
}));

const DisplayPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  textAlign: 'right',
  minHeight: '2.5em',
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperationClick = (op: string) => {
    if (firstOperand === null) {
      setFirstOperand(parseFloat(display));
      setOperation(op);
      setDisplay('0');
    } else {
      handleEqualsClick();
      setOperation(op);
    }
  };

  const handleEqualsClick = async () => {
    if (firstOperand !== null && operation) {
      setLoading(true);
      try {
        const result = await backend.calculate(operation, firstOperand, parseFloat(display));
        if (result !== null) {
          setDisplay(result.toString());
          setFirstOperand(null);
          setOperation(null);
        } else {
          setDisplay('Error');
        }
      } catch (error) {
        console.error('Calculation error:', error);
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <CalculatorPaper elevation={3}>
      <DisplayPaper elevation={1}>
        <Typography variant="h4">{display}</Typography>
      </DisplayPaper>
      <Grid container spacing={1}>
        {buttons.map((btn) => (
          <Grid item xs={3} key={btn}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                if (btn === '=') handleEqualsClick();
                else if (['+', '-', '*', '/'].includes(btn)) handleOperationClick(btn);
                else handleNumberClick(btn);
              }}
              sx={{
                backgroundColor: ['+', '-', '*', '/', '='].includes(btn) ? '#FFC107' : '#2196F3',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: ['+', '-', '*', '/', '='].includes(btn) ? '#FFD54F' : '#42A5F5',
                },
              }}
            >
              {btn}
            </Button>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleClear}
            sx={{
              backgroundColor: '#F44336',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#EF5350',
              },
            }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </CalculatorPaper>
  );
};

export default App;