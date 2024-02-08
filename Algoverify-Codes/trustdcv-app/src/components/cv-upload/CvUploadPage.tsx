import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Form from "react-bootstrap/Form";
import { Button, InputGroup } from "react-bootstrap";

import FileUpload from "./FileUpLoad";
import BasicDatePicker from "./BasicDatePicker";
import SoftSkill from "./SoftSkillRate";
import { useMutationApi } from "@/hooks/useMutationApi";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

function CvUploadPage() {
  const [cvupload, setCvUpLoad] = useState({
    name: "",
    email: "",
    file: "",
    softSkills: [
      { name: "", rating: 0 },
      { name: "", rating: 0 },
      { name: "", rating: 0 },
    ],
  });
  const cvUploader = useMutationApi("fileUpload");

  const [refereeList, setRefereeList] = useState([
    {
      rname: "",
      remail: "",
      position: "",
      role: "",
      company: "",
      startDate: "",
      endDate: "",
      relationship: "",
    },
  ]);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [errors, setErrors] = useState<any>("");

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setCvUpLoad((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleFileChange = (e: any) => {
    const name = "file";
    const value = e[0];
    setCvUpLoad((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSoftSkillsChange = (softSkills: any) => {
    setCvUpLoad((prevCvUpload) => ({
      ...prevCvUpload,
      softSkills: softSkills,
    }));
  };
  const { name, email, file, softSkills } = cvupload;

  const handleRefereeAdd = () => {
    setRefereeList([
      ...refereeList,
      {
        rname: "",
        remail: "",
        position: "",
        role: "",
        company: "",
        startDate: "",
        endDate: "",
        relationship: "",
      },
    ]);
  };

  const handleRefereeRemove = (index: number) => {
    const list = [...refereeList];
    list.splice(index, 1);
    setRefereeList(list);
  };

  const handleRefereeChange = (e: any, index: number) => {
    const { name, value } = e.target;
    const list: any[] = [...refereeList];
    list[index][name] = value;
    setRefereeList(list);
  };

  const handleDataChange = (e: any, index: number) => {
    let name = e.type === 1 ? "startDate" : "endDate";
    let value = e.type === 1 ? e.startDate : e.endDate;

    const list: any[] = [...refereeList];
    list[index][name] = value;
    setRefereeList(list);
  };

  async function handleSubmit(e: any) {
    setFormSubmitted(true);

    e.preventDefault();

    const errors: any = {};

    setErrors(errors);
    if (name.trim() === "") {
      errors.name = "Name is required!";
    }

    if (email.trim() === "") {
      errors.email = "Email is required!";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      toast.error("Plaese input a correct email format.");
    }
    if (file === "") {
      errors.file = "File is required!";
      toast.error("Must upload your CV");
    }
    if (
      !cvupload.softSkills.every(
        (skill) => skill.name.trim() !== "" && skill.rating !== 0
      )
    ) {
      errors.softSkills = "All soft skills fields are required!";
      toast.error("All soft skills fields are required!");
    }
    refereeList.forEach((referee, index) => {
      if (referee.rname.trim() === "") {
        errors[index] = {
          ...errors[index],
          rname: "Referee name is required",
        };
      }
      if (referee.remail.trim() === "") {
        errors[index] = "Referee Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(referee.remail)
      ) {
        errors[index] = "Referee Email is not a correct format";
      }
      if (referee.position === "") {
        errors[index] = "Referee postition is required";
      }
      if (referee.role === "") {
        errors[index] = "Referee role is required";
      }
      if (referee.company === "") {
        errors[index] = "Referee company is required";
      }
      if (referee.startDate === "") {
        errors[index] = "Referee startDate is required";
      }
      if (referee.endDate === "") {
        errors[index] = "Referee endDate is required";
      }
      if (referee.startDate >= referee.endDate) {
        errors[index] = "Incorrect date";
      }
      if (referee.relationship === "") {
        errors[index] = "Referee relationship is required";
      }
    });

    if (Object.keys(errors).length > 0) {
      console.log(errors);
      // Display errors to the user
      toast.error("please fill all the input.");
    } else {
      await cvUploader.mutateAsync({
        appName: name,
        emailAddress: email,
        file: file,
        list: JSON.stringify(refereeList),
        softSkills: JSON.stringify(softSkills),
      });
      localStorage.setItem("SoftSkill", JSON.stringify(softSkills));
      toast.success("Your cv is uploaded.");
    }
  }

  return (
    <div className="container mt-4">
      <ToastContainer autoClose={5000} theme="colored" />
      <Form className="mt-3 ml-0 mr-0">
        <div className="form-text text-muted mb-5">
          Welcome to AlgoVerify IITB, Here you can upload your CV (in .PDF, .DOC or
          .DOCX format) so we can check your references in advance for future
          employers. Please add your latest CV and add your referees below ( we
          recommend that you add the latest few referees a minimum of 2). By
          filling this in you are giving us permission to contact this person.
          Before we upload the references you will have an option to add this
          information to your profile.
        </div>
        <InputGroup className="mb-3 gap-3 bg-light border p-3" size="lg">
          <InputGroup>
            <InputGroup.Text style={{ width: "150px" }}>Name:</InputGroup.Text>
            <Form.Control
              id="name"
              size="sm"
              name="name"
              placeholder="Name"
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={name}
              onChange={handleInputChange}
            />
          </InputGroup>
          {errors?.name && <p className="text-danger">{errors.name}</p>}

          <InputGroup>
            <InputGroup.Text style={{ width: "150px" }}>
              Email Address:
            </InputGroup.Text>
            <Form.Control
              id="email"
              size="sm"
              name="email"
              placeholder="Email"
              aria-label="UserEmail"
              aria-describedby="basic-addon1"
              value={email}
              onChange={handleInputChange}
            />
          </InputGroup>
          {errors.email && <p className="text-danger">{errors.email}</p>}

          <InputGroup>
            <FileUpload value={file} onChange={handleFileChange} />
            {errors.file && <p className="text-danger">{errors.file}</p>}
          </InputGroup>
          <br></br>

          <SoftSkill onSoftSkillsChange={handleSoftSkillsChange} />
          {errors.softSkills && (
            <p className="text-danger">{errors.softSkills}</p>
          )}
        </InputGroup>

        {refereeList.map((siglereferee, index) => (
          <InputGroup
            key={index}
            className="mb-3 gap-3 bg-light border p-3"
            size="lg"
          >
            <InputGroup className="mb-3 gap-3">
              <InputGroup>
                <InputGroup.Text style={{ width: "150px" }}>
                  Referee Name:
                </InputGroup.Text>
                <Form.Control
                  value={siglereferee.rname}
                  onChange={(e: any) => handleRefereeChange(e, index)}
                  name="rname"
                  size="sm"
                  placeholder="Referee Name"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  required
                />
                {siglereferee.rname === "" && formSubmitted && (
                  <Form.Text className="text-danger">
                    Please enter a referee name
                  </Form.Text>
                )}
              </InputGroup>

              <InputGroup>
                <InputGroup.Text style={{ width: "150px" }}>
                  Referee Email:
                </InputGroup.Text>
                <Form.Control
                  value={siglereferee.remail}
                  onChange={(e: any) => handleRefereeChange(e, index)}
                  name="remail"
                  size="sm"
                  placeholder="Referee Email"
                  aria-label="UserEmail"
                  aria-describedby="basic-addon1"
                  required
                />

                {siglereferee.remail === "" && formSubmitted && (
                  <Form.Text className="text-danger">
                    Please enter a referee email.
                  </Form.Text>
                )}
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "150px" }}>
                  Position:
                </InputGroup.Text>
                <Form.Control
                  value={siglereferee.position}
                  name="position"
                  onChange={(e: any) => handleRefereeChange(e, index)}
                  aria-label="Text input with checkbox"
                />
                {siglereferee.position === "" && formSubmitted && (
                  <Form.Text className="text-danger">
                    Please enter an position
                  </Form.Text>
                )}
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "150px" }}>
                  Role:
                </InputGroup.Text>
                <Form.Control
                  value={siglereferee.role}
                  name="role"
                  onChange={(e: any) => handleRefereeChange(e, index)}
                  aria-label="Text input with checkbox"
                />
                {siglereferee.role === "" && formSubmitted && (
                  <Form.Text className="text-danger">
                    Please enter a role
                  </Form.Text>
                )}
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text style={{ width: "150px" }}>
                  Company:
                </InputGroup.Text>
                <Form.Control
                  value={siglereferee.company}
                  name="company"
                  onChange={(e: any) => handleRefereeChange(e, index)}
                  aria-label="Text input with checkbox"
                />
                {siglereferee.company === "" && formSubmitted && (
                  <Form.Text className="text-danger">
                    Please enter a company
                  </Form.Text>
                )}
              </InputGroup>

              <BasicDatePicker
                onChange={(e: any) => handleDataChange(e, index)}
              />
              {siglereferee.startDate === "" &&
                siglereferee.endDate === "" &&
                formSubmitted && (
                  <Form.Text className="text-danger">
                    Please enter a Date
                  </Form.Text>
                )}

              <InputGroup className="mb-3">
                <InputGroup.Text style={{ minWidth: "150px" }}>
                  Relationship to you:
                </InputGroup.Text>
                <Form.Control
                  value={siglereferee.relationship}
                  name="relationship"
                  onChange={(e: any) => handleRefereeChange(e, index)}
                  aria-label="Text input with checkbox"
                />
                {siglereferee.relationship === "" && formSubmitted && (
                  <Form.Text className="text-danger">
                    Please enter an relationship
                  </Form.Text>
                )}
              </InputGroup>
              <hr />
            </InputGroup>

            {refereeList.length - 1 === index && refereeList.length < 10 && (
              <Button onClick={handleRefereeAdd}>+ Add Referee</Button>
            )}
            {refereeList.length > 1 && (
              <Button
                variant="danger"
                onClick={() => handleRefereeRemove(index)}
              >
                <span>delete</span>
              </Button>
            )}
          </InputGroup>
        ))}

        <br></br>
        <Button onClick={handleSubmit}>Submit</Button>
      </Form>
    </div>
  );
}

export default CvUploadPage;
