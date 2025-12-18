const mapQualityDesignationToUserFriendlyString = (qualityDesignation) => {
    switch (qualityDesignation) {
        case "accredited-official":
            return "National Statistic";
        case "official":
            return "Official Statistic";
        case "official-in-development":
            return "Official Statistic in Development";
        case "no-accreditation":
            return "No accreditation";
        default: 
            return qualityDesignation; 
    }
};

export { mapQualityDesignationToUserFriendlyString };
