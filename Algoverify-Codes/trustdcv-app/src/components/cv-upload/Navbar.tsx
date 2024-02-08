import Link from "next/link";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" href="/">
          CV Upload Page{" "}
        </Link>
      </div>
    </nav>
  );
}
//Welcome to Trust’d CVs Here you can upload your CV (in .PDF, .DOC or .DOCX format) so we can check your references in advance for future employers. Please add your latest CV and add your referees below ( we recommend that you add the latest few referees a minimum of 2). By filling this in you are giving us permission to contact this person. Before we upload the references you will have an option to add this information to your profile.
export default Navbar;
