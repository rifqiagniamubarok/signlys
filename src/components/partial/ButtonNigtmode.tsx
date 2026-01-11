'use client';
import { Button } from '@nextui-org/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ButtonNigtmode = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button isIconOnly variant="faded">
        <div className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Button
      onClick={() => {
        if (theme === 'light') setTheme('dark');
        else setTheme('light');
      }}
      isIconOnly
      variant="faded"
    >
      {theme === 'light' ? <Sun /> : <Moon />}
    </Button>
  );
};
export default ButtonNigtmode;
