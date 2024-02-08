import React, { useState } from "react";
import Rating from "@mui/material/Rating";

import { InputGroup } from "react-bootstrap";
import { Form } from "react-bootstrap";
export interface SoftSkillProps {
  onSoftSkillsChange: (softSkills: any) => void;
}
export default function SoftSkill({ onSoftSkillsChange }: SoftSkillProps) {
  const [softSkills, setSoftSkills] = useState([
    { name: "", rating: 0 },
    { name: "", rating: 0 },
    { name: "", rating: 0 },
  ]);

  const handleRating = (index: number, rate: number | null) => {
    setSoftSkills((prevSoftSkills) => {
      const newSoftSkills = [...prevSoftSkills];
      newSoftSkills[index].rating = rate || 0;
      return newSoftSkills;
    });
    onSoftSkillsChange(softSkills);
  };

  const handleNameChange = (index: number, e: any) => {
    setSoftSkills((prevSoftSkills) => {
      const newSoftSkills = [...prevSoftSkills];
      newSoftSkills[index].name = e.target.value;
      return newSoftSkills;
    });
    onSoftSkillsChange(softSkills);
  };

  return (
    <div className="App">
      {softSkills.map((softSkill, index) => (
        <InputGroup key={index}>
          <InputGroup.Text id={`basic-addon${index}`}>
            Soft Skill {index + 1}:
          </InputGroup.Text>
          <Form.Control
            size="sm"
            placeholder={`Soft Skill ${index + 1}`}
            value={softSkill.name}
            onChange={(e: any) => handleNameChange(index, e)}
            aria-label="Soft Skill"
            aria-describedby={`basic-addon${index}`}
          />
          <Rating
            onChange={(_, newValue) => handleRating(index, newValue)}
            value={softSkill.rating}
          />
          {softSkill.rating}
        </InputGroup>
      ))}
    </div>
  );
}
