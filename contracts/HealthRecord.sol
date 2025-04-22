// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;



contract HealthRecord{
    struct Record {
        uint patientId;
        string data;
        address addedBy;
        uint timestamp;
        bool isVisible;
    }

    struct Doctor {
        uint doctorId;
        bool isRegistered;
        mapping(uint => bool) patientConsent;
        uint[] ratings;
    }

    struct Patient {
        uint patientId;
        bool isRegistered;
        mapping(uint => bool) doctorConsent;
        mapping(uint => bool) hasRated;
        Record[] records;
    }

    mapping(uint => Doctor) public doctors;
    mapping(uint => Patient) public patients;

    mapping(address => uint) public doctorAddresses;
    mapping(address => uint) public patientAddresses;

    mapping(uint => bool) private doctorIds;
    mapping(uint => bool) private patientIds;

    event DoctorAssigned(uint indexed doctorId);
    event DoctorRemoved(uint indexed doctorId);
    event PatientRegistered(uint indexed patientId);
    event PatientRemoved(uint indexed patientId);
    event RecordAdded(uint indexed doctorId, uint indexed patientId);
    event RecordUpdated(uint indexed doctorId, uint indexed patientId, uint index);
    event RatingGiven(uint indexed patientId, uint indexed doctorId, uint rating);
    event RatingUpdated(uint indexed patientId, uint indexed doctorId, uint oldRating, uint newRating);
    event ConsentGiven(uint indexed patientId, uint indexed doctorId, bool consent);
    event RecordVisibilityChanged(uint indexed patientId, uint indexed doctorId, uint index, bool isVisible);

    modifier onlyDoctor(uint doctorId) {
        require(doctorAddresses[msg.sender] == doctorId, "Not authorized doctor");
        require(doctors[doctorId].isRegistered, "Doctor not registered");
        _;
    }

    modifier onlyPatient(uint patientId) {
        require(patientAddresses[msg.sender] == patientId, "Not authorized patient");
        require(patients[patientId].isRegistered, "Patient not registered");
        _;
    }

    // =========================
    // Registration
    // =========================

    function registerPatient(uint patientId) public {
        require(patientAddresses[msg.sender] == 0, "Already registered as patient");
        require(!patientIds[patientId], "Patient ID already taken");

        patients[patientId].patientId = patientId;
        patients[patientId].isRegistered = true;
        patientAddresses[msg.sender] = patientId;
        patientIds[patientId] = true;

        emit PatientRegistered(patientId);
    }

    function registerDoctor(uint doctorId) public {
        require(doctorAddresses[msg.sender] == 0, "Already registered as doctor");
        require(!doctorIds[doctorId], "Doctor ID already taken");

        doctors[doctorId].doctorId = doctorId;
        doctors[doctorId].isRegistered = true;
        doctorAddresses[msg.sender] = doctorId;
        doctorIds[doctorId] = true;

        emit DoctorAssigned(doctorId);
    }

    
    // =========================
    // Consent
    // =========================

    function giveConsent(uint patientId, uint doctorId, bool consent) public onlyPatient(patientId) {
        require(doctors[doctorId].isRegistered, "Doctor not registered");
        patients[patientId].doctorConsent[doctorId] = consent;
        emit ConsentGiven(patientId, doctorId, consent);
    }

    function hasGivenConsent(uint patientId, uint doctorId) public view returns (bool) {
        return patients[patientId].doctorConsent[doctorId];
    }

    // =========================
    // Rating
    // =========================

    function giveRating(uint patientId, uint doctorId, uint rating) public onlyPatient(patientId) {
        require(rating >= 1 && rating <= 5, "Rating must be 1-5");
        require(doctors[doctorId].isRegistered, "Doctor not registered");

        if (patients[patientId].hasRated[doctorId]) {
            uint[] storage ratings = doctors[doctorId].ratings;
            uint oldRating = ratings[ratings.length - 1];
            ratings[ratings.length - 1] = rating;
            emit RatingUpdated(patientId, doctorId, oldRating, rating);
        } else {
            patients[patientId].hasRated[doctorId] = true;
            doctors[doctorId].ratings.push(rating);
            emit RatingGiven(patientId, doctorId, rating);
        }
    }

    function getMyRating(uint doctorId) public view onlyDoctor(doctorId) returns (uint) {
        return getDoctorRating(doctorId);
    }

    function getDoctorRating(uint doctorId) public view returns (uint average) {
        require(doctors[doctorId].isRegistered, "Doctor not registered");
        uint[] storage ratings = doctors[doctorId].ratings;
        if (ratings.length == 0) return 0;

        uint sum = 0;
        for (uint i = 0; i < ratings.length; i++) {
            sum += ratings[i];
        }
        return sum / ratings.length;
    }

    // =========================
    // Record Management
    // =========================

    function addRecord(uint patientId, uint doctorId, string memory data) public onlyDoctor(doctorId) {
        require(hasGivenConsent(patientId, doctorId), "Consent not given");

        Record memory newRecord = Record({
            patientId: patientId,
            data: data,
            addedBy: msg.sender,
            timestamp: block.timestamp,
            isVisible: true
        });

        patients[patientId].records.push(newRecord);
        emit RecordAdded(doctorId, patientId);
    }

    function updateRecord(uint patientId, uint doctorId, uint index, string memory data) public onlyDoctor(doctorId) {
        require(index < patients[patientId].records.length, "Invalid index");
        Record storage record = patients[patientId].records[index];
        require(record.addedBy == msg.sender, "Only original doctor can update");
        require(record.isVisible, "Record is not visible");

        record.data = data;
        record.timestamp = block.timestamp;

        emit RecordUpdated(doctorId, patientId, index);
    }

    function toggleRecordVisibility(uint patientId, uint doctorId, uint index, bool visible) public onlyDoctor(doctorId) {
        require(index < patients[patientId].records.length, "Invalid index");
        Record storage record = patients[patientId].records[index];
        require(record.addedBy == msg.sender, "Only original doctor can change visibility");

        record.isVisible = visible;
        emit RecordVisibilityChanged(patientId, doctorId, index, visible);
    }

    function getRecords(uint patientId, uint doctorId) public view returns (Record[] memory) {
    bool isPatient = (patientAddresses[msg.sender] == patientId);

    if (!isPatient) {
        require(doctors[doctorId].isRegistered, "Doctor not registered");
        require(hasGivenConsent(patientId, doctorId), "No consent given");
    }

    Record[] storage full = patients[patientId].records;

    // If caller is the patient, return all records (including invisible)
    if (isPatient) {
        return full;
    }

    // Else (doctor), return only visible records
    uint count = 0;
    for (uint i = 0; i < full.length; i++) {
        if (full[i].isVisible) count++;
    }

    Record[] memory filtered = new Record[](count);
    uint idx = 0;
    for (uint i = 0; i < full.length; i++) {
        if (full[i].isVisible) {
            filtered[idx++] = full[i];
        }
    }

    return filtered;
}

    function getMyRecords(uint patientId) public view onlyPatient(patientId) returns (Record[] memory) {
        return patients[patientId].records;
    }

    function getRecordsPaginated(uint patientId, uint doctorId, uint start, uint limit) public view returns (Record[] memory) {
        require(doctors[doctorId].isRegistered, "Doctor not registered");
        require(hasGivenConsent(patientId, doctorId), "Consent not given");

        Record[] storage all = patients[patientId].records;
        require(start < all.length, "Start out of range");

        uint end = start + limit > all.length ? all.length : start + limit;
        uint visibleCount = 0;

        for (uint i = start; i < end; i++) {
            if (all[i].isVisible) visibleCount++;
        }

        Record[] memory paginated = new Record[](visibleCount);
        uint idx = 0;
        for (uint i = start; i < end; i++) {
            if (all[i].isVisible) {
                paginated[idx++] = all[i];
            }
        }
        return paginated;
    }
}
