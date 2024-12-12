// src/components/GoogleSignIn.tsx
import React, { useState, useEffect, SetStateAction } from 'react';
import { createClient } from "@supabase/supabase-js";

const Supabase: React.FC = () => {
  interface Country{
    name:string;
  };

  const [countries, setCountries] = useState<Country[]>([]);
  const REACT_APP_SUPABASE_URL="https://dqsxvnnmyhafphdncvqq.supabase.co"
  const REACT_APP_SUPABASE_ANON_KEY=//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxc3h2bm5teWhhZnBoZG5jdnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMTUxMTUsImV4cCI6MjA0OTU5MTExNX0.2pfvofRIcRKW6BdzKWpU6ALZGWGChK24DpN6TODiJjw";
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRx"+
    "c3h2bm5teWhhZnBoZG5jdnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMTUxMTUsImV4c"+
    "CI6MjA0OTU5MTExNX0.2pfvofRIcRKW6BdzKWpU6ALZGWGChK24DpN6TODiJjw";
  const supabase = createClient(REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY);


  const insert = async () => {
    const { data, error } = await supabase
      .from('countries')
      .insert([{ name: 'Moldova' }]);
    console.log(data, error);
  };

  useEffect(() => {
    // insert();
    getCountries();
  }, []);

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
    console.log(data);
    setCountries(data as SetStateAction<Country[]>);
  }

  // return <div id="g_id_signin"></div>;
  return (
    <ul>
      {countries.map((country:Country) => (
        <li key={country.name}>{country.name}</li>
      ))}
    </ul>
  );
};

export default Supabase;