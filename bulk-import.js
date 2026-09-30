const fs = require('fs');

async function importData() {
  const roomMap = {
    "1": "B01",
    "2": "B02",
    "3": "B03",
    "4": "B04",
    "5": "B05",
    "6": "101",
    "7": "102",
    "8": "103",
    "9": "104",
    "10": "105",
    "11": "201",
    "12": "202",
    "13": "203",
    "14": "204",
    "15": "205",
    "16": "206",
    "17": "207",
    "18": "208",
    "19": "209",
    "20": "210"
  };

  const tenants = [
    {
      name: "HAISHAM MUHAMMED N", phone: "8089791560", parentName: "MUHAMMED N", parentPhone: "8086156030", occupation: "Teacher",
      courseName: "B.Tech EC", dateOfBirth: "2008-03-26", checkInDate: "2026-07-21", roomNumber: roomMap["18"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "MOHAMMED ZAYAN T", phone: "9061952940", parentName: "Shamsiya P M", parentPhone: "8606262940", occupation: "doctor",
      courseName: "ECE", dateOfBirth: "2008-03-08", checkInDate: "2026-07-21", roomNumber: roomMap["20"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "AMAN HANEES MOHAMMED", phone: "7558966320", parentName: "HANEES MOHAMMED", parentPhone: "9539466320", permanentAddress: "THALAKKASSERY PO, PALAKKAD", occupation: "BANK EMPLOYEE",
      courseName: "BTECH INDUSTRIAL ENG", dateOfBirth: "2008-04-01", checkInDate: "2026-07-20", roomNumber: roomMap["20"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "FUAD K", phone: "9562426903", parentName: "Hilaludheen K", parentPhone: "9745150224", permanentAddress: "A Mukkam", occupation: "Business",
      courseName: "Electrical & Electronics", dateOfBirth: "2007-07-27", checkInDate: "2026-07-23", roomNumber: roomMap["15"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Muhammad Rayyan", phone: "6282931593", parentName: "Shafeek", parentPhone: "6282623863", permanentAddress: "Oachira PO",
      courseName: "EC", dateOfBirth: "2006-07-05", checkInDate: "2026-07-21", roomNumber: roomMap["15"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "ALTHAF MUHAMMAD S", phone: "9495626682", parentName: "Ansiya A", parentPhone: "9447179668", permanentAddress: "Muhsina Mahal, Kottukadu", occupation: "Homemaker",
      courseName: "ECE", dateOfBirth: "2006-11-14", checkInDate: "2026-07-21", roomNumber: roomMap["16"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "AMEEN IQBAL AB", phone: "9656266992", parentName: "IQBAL ALIAMBATH", parentPhone: "9349896200", permanentAddress: "FARAH, CHERUMAVIKAYI", occupation: "FTHR",
      courseName: "EC", dateOfBirth: "2006-11-07", checkInDate: "2026-07-21", roomNumber: roomMap["16"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Anjoo Mejo", phone: "9995802281", parentName: "Mejo MF", parentPhone: "9995802281", occupation: "Teacher",
      courseName: "EL", dateOfBirth: "2008-02-13", checkInDate: "2026-07-21", roomNumber: roomMap["17"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "AASHIK MOHAMMED", phone: "8891695217", parentName: "NAVAZ P K", parentPhone: "7356995217", occupation: "Ex-Servicemen",
      courseName: "ECE", dateOfBirth: "2007-12-24", checkInDate: "2026-07-21", roomNumber: roomMap["17"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Ridwan A.K.", phone: "8606061480", parentName: "Mohamad A.K.", parentPhone: "9895231212", permanentAddress: "Pulikkal, Malappuram",
      courseName: "ECE", dateOfBirth: "2006-11-08", checkInDate: "2026-07-24", roomNumber: roomMap["12"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "RON EMMANUEL JOSHY", phone: "9746554213", parentName: "JOSHY MANUEL", parentPhone: "9447914213", permanentAddress: "Muvattupuzha", occupation: "Chartered Accountant",
      courseName: "Mechanical Engineering", dateOfBirth: "2008-07-30", checkInDate: "2026-08-13", roomNumber: roomMap["8"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "ADAM BIN ZAMEER", phone: "", parentName: "Zameer K.H", parentPhone: "8921498204", permanentAddress: "Kothappurathu House, Kayamkulam", occupation: "Assistant Professor",
      courseName: "B.tech EE", dateOfBirth: "2007-01-29", checkInDate: "2026-07-20", roomNumber: roomMap["9"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Ahmed Sahil S", phone: "8078148894", parentName: "Sherief kutty .M", parentPhone: "9544985476", permanentAddress: "HAMDAS NEDUMPANA PO, KOLLAM", occupation: "Teacher",
      courseName: "EEE", dateOfBirth: "2007-03-16", checkInDate: "2026-07-21", roomNumber: roomMap["11"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Shiraz Aymen MK", phone: "9178207433", parentName: "Naofal Babu MK", parentPhone: "9539696608", occupation: "SVO",
      courseName: "B-Tech ECE", dateOfBirth: "2007-01-25", checkInDate: "2026-07-21", roomNumber: roomMap["1"], advanceDeposit: 5000, paymentMethod: "CASH"
    },
    {
      name: "ABAD AHMED K", phone: "7012469796", parentName: "SHAMSUDHEEN K", parentPhone: "9447350680", permanentAddress: "KAMASSERI, VAZHAKKAD", occupation: "Private Job",
      courseName: "EL", dateOfBirth: "2007-11-05", checkInDate: "2026-07-21", roomNumber: roomMap["1"], advanceDeposit: 5000, paymentMethod: "CASH"
    },
    {
      name: "Sivadath P.M", phone: "7907241668", parentName: "Manoj P.V", parentPhone: "9388695067", permanentAddress: "PERAMBRA P.O THRISSUR", occupation: "Temple priest",
      courseName: "EEE", dateOfBirth: "2007-10-12", checkInDate: "2026-07-21", roomNumber: roomMap["2"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Adarsh K.S", phone: "7909221164", parentName: "SUDHEESH KUMAR", parentPhone: "9895113731", occupation: "oil & gas fabrication",
      courseName: "ECE", dateOfBirth: "2007-07-03", checkInDate: "2026-07-21", roomNumber: roomMap["5"], advanceDeposit: 1000, paymentMethod: "UPI"
    },
    {
      name: "Fadhlu Rahman NK", phone: "7736267850", parentName: "Hamza NK", parentPhone: "9947635070", occupation: "Retired Teacher",
      courseName: "IE", dateOfBirth: "2007-03-07", checkInDate: "2026-07-20", roomNumber: roomMap["2"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Mohammed Rafid MP", phone: "9778259117", parentName: "Muhammed Rafeeque MP", parentPhone: "7736227585", occupation: "Gulf",
      courseName: "IE", dateOfBirth: "2007-05-11", checkInDate: "2026-07-20", roomNumber: roomMap["3"], advanceDeposit: 5000, paymentMethod: "CASH"
    },
    {
      name: "Sinan Saeed", phone: "8089433415", parentName: "Saidalavi", parentPhone: "9567703415", permanentAddress: "Kutteerithodi house", occupation: "Driver",
      courseName: "Industrial engneering", dateOfBirth: "2006-09-01", checkInDate: "2026-07-20", roomNumber: roomMap["3"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Ahsan Ameer C.K", phone: "8281640093", parentName: "Muhammed Ameer C.K", parentPhone: "9497647506", occupation: "Teacher",
      courseName: "Civil Engineering", dateOfBirth: "2007-04-23", checkInDate: "2026-08-10", roomNumber: roomMap["4"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Muhammed Ameen P", phone: "9074159429", parentName: "Abdul Jaleel P", parentPhone: "974477488", permanentAddress: "Perumpalli", occupation: "Shop",
      courseName: "ECE", dateOfBirth: "2007-09-28", checkInDate: "2026-07-21", roomNumber: roomMap["5"], advanceDeposit: 9000, paymentMethod: "UPI"
    },
    {
      name: "Sooraj Jayaraj R", phone: "9946781729", parentName: "Jayaraj K", parentPhone: "9495581191", permanentAddress: "Kozhikode", occupation: "Govt Service",
      courseName: "Computer Science", dateOfBirth: "2006-06-07", checkInDate: "2026-07-21", roomNumber: roomMap["5"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Muhammed Vishan", phone: "7306318623", parentName: "Sameera", parentPhone: "9846005698", permanentAddress: "Angadippuram Malappuram", occupation: "House wife",
      courseName: "EEE", dateOfBirth: "2006-05-25", checkInDate: "2026-07-20", roomNumber: roomMap["6"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Govind Siva A", phone: "7306003914", parentName: "Aneesh Kumar S", parentPhone: "9446121348", permanentAddress: "Cherthala, Alappuzha", occupation: "Personal Security Officer",
      courseName: "Industrial Engineering", dateOfBirth: "2007-01-04", checkInDate: "2026-07-21", roomNumber: roomMap["19"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Eshan Krishnan CM", phone: "7012792692", parentName: "Manoj Chandran", parentPhone: "9447530577", permanentAddress: "Ponnore PO TCR",
      courseName: "EC", dateOfBirth: "2007-07-14", checkInDate: "2026-07-21", roomNumber: roomMap["19"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Adeeb Abdullah Noushad TV", phone: "8593838006", parentName: "Noushad TV", parentPhone: "8157854800", permanentAddress: "Malappuram",
      courseName: "ECE", dateOfBirth: "2006-09-17", checkInDate: "2026-07-21", roomNumber: roomMap["18"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Muhammad Hamdhan", phone: "9037350284", parentName: "Hafismlyasin", parentPhone: "9037350284", permanentAddress: "Thrissur",
      courseName: "EEE", dateOfBirth: "2008-10-06", checkInDate: "2026-07-21", roomNumber: roomMap["13"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Abhinand Krishna SA", phone: "9207744999", parentName: "Anand Aravind SA", parentPhone: "9447082277", occupation: "Business",
      courseName: "CIVIL", dateOfBirth: "2006-06-29", checkInDate: "2026-07-16", roomNumber: roomMap["11"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Eshan Ahmed", phone: "9544788658", parentName: "Firas Babu OB", parentPhone: "9739498080", occupation: "Self Employed",
      courseName: "AEI", dateOfBirth: "2008-03-31", checkInDate: "2026-07-20", roomNumber: roomMap["12"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Sreehari S", phone: "8921527415", parentName: "Santhosh Kumar NV", parentPhone: "9496328680", permanentAddress: "Chavara South PO Kollam",
      courseName: "EEE", dateOfBirth: "2007-06-12", checkInDate: "2026-07-20", roomNumber: roomMap["6"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Shakir Chalilakath", phone: "9745705432", parentName: "CA Safeeque", parentPhone: "9847619616", occupation: "Teacher",
      courseName: "ECE", dateOfBirth: "2008-03-05", checkInDate: "2026-07-22", roomNumber: roomMap["8"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Aman Mohammed KK", phone: "9961115385", parentName: "Shamsudheen kk", parentPhone: "8943988885", occupation: "Business",
      courseName: "Applied Electronics", dateOfBirth: "2007-07-02", checkInDate: "2026-07-21", roomNumber: roomMap["8"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Swalah CP", phone: "9846149078", parentName: "Abdul Vahab CP", parentPhone: "8547172070", occupation: "Teacher",
      courseName: "CSE", dateOfBirth: "2007-09-14", checkInDate: "2026-07-22", roomNumber: roomMap["7"], advanceDeposit: 5000, paymentMethod: "UPI"
    },
    {
      name: "Nasih Usman", phone: "9400758823", parentName: "Usman KV", parentPhone: "9847190111", occupation: "Retired",
      courseName: "EEE", dateOfBirth: "2008-04-09", checkInDate: "2026-07-20", roomNumber: roomMap["9"], advanceDeposit: 5000, paymentMethod: "UPI"
    }
  ];

  try {
    const response = await fetch('http://localhost:3000/api/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: "bulk_import", tenants })
    });
    const result = await response.json();
    console.log("Bulk import result:", result);
  } catch (err) {
    console.error("Bulk import failed:", err);
  }
}

importData();
