export const create = async (profile) => {
    const transformedProfile = {
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        birthdate: profile.dob,
        address: profile.address,
        program: `${profile.course} ${profile.major}`.trim(),
        status: profile.status,
    };

    console.log("Sending to legacy system:");
    console.log(transformedProfile);

    const response = await fetch('https://ais-simulated-legacy.onrender.com/api/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedProfile),
    });

    console.log("Legacy response status:", response.status);

    if (!response.ok) {
        const text = await response.text();
        console.log("Legacy response error body:", text);
        throw new Error(`Legacy system request failed: ${response.status} ${text}`);
    }

    const data = await response.json();
    console.log("Legacy response success body:", data);

    return data;
};