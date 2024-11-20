import React from 'react'

const OfficeList = () => {
  return (
    <div style={styles.container}>
      {/* Main wrapper with flex layout for Avatar and Information */}
      <div style={styles.mainContent}>
        
        {/* Avatar Section */}
        <div style={styles.avatarSection}>
          <div style={styles.avatar}></div>
          <button style={styles.chooseFileButton}>Choose File</button>
        </div>
        
        {/* Information Section */}
        <div style={styles.infoSection}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input type="text" id="username" style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input type="email" id="email" style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="phone" style={styles.label}>Phone Number</label>
            <input type="tel" id="phone" style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="address" style={styles.label}>Home Address</label>
            <input type="text" id="address" style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="role" style={styles.label}>Role</label>
            <input type="text" id="role" value="Network Administrator" disabled style={styles.input} />
          </div>

          {/* Buttons Section */}
          <div style={styles.buttonGroup}>
            <button style={styles.editBtn}>Edit</button>
            <button style={styles.saveBtn}>Save</button>
            <button style={styles.changePasswordBtn}>Change Password</button>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div style={styles.settings}>
        <button style={styles.backupBtn}>Backup all data</button>
        <button style={styles.apiBtn}>API Setting</button>
        <button style={styles.githubBtn}>Github</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '80px auto',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',    
  },
  mainContent: {
    display: 'flex', // Flexbox layout to align avatar and information side by side
    justifyContent: 'space-between',
    gap: "30px"
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: '20px',
    flex: '1',
  },
  avatar: {
    width: '250px',
    height: '350px',
    backgroundColor: '#ccc',
    marginBottom: '10px',
    borderRadius: '8px',
  },
  chooseFileButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  infoSection: {
    flex: '3', // Take more space than the avatar section
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  buttonGroup: {
    marginTop: '20px',
    display: 'flex',
    // justifyContent: 'space-between',
      gap: "20px"
  },
  editBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
  changePasswordBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#ffc107',
    color: 'white',
    cursor: 'pointer',
  },
  settings: {
    marginTop: '30px',
    margin: "30px 238px"
  },
  backupBtn: {
    padding: '10px 20px',
    marginRight: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#6c757d',
    color: 'white',
    cursor: 'pointer',
  },
  apiBtn: {
    padding: '10px 20px',
    marginRight: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#17a2b8',
    color: 'white',
    cursor: 'pointer',
  },
  githubBtn: {
    padding: '10px 20px',
    marginRight: '10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#333',
    color: 'white',
    cursor: 'pointer',
  },
};


export default OfficeList
