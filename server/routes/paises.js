const express = require('express');
const app = express();
const http = require('http');
const paises =
{
    "MX": "Mexico",
    "BD": "Bangladesh",
    "BE": "Belgium",
    "BF": "Burkina Faso",
    "BG": "Bulgaria",
    "BA": "Bosnia and Herzegovina",
    "BB": "Barbados",
    "WF": "Wallis and Futuna",
    "BL": "Saint Barthelemy",
    "BM": "Bermuda", "BN": "Brunei",
    "BO": "Bolivia", "BH": "Bahrain",
    "BI": "Burundi", "BJ": "Benin",
    "BT": "Bhutan", "JM": "Jamaica",
    "BV": "Bouvet Island", "BW": "Botswana",
    "WS": "Samoa", "BQ": "Bonaire, Saint Eustatius and Saba ",
    "BR": "Brazil", "BS": "Bahamas",
    "JE": "Jersey", "BY": "Belarus",
    "BZ": "Belize", "RU": "Russia",
    "RW": "Rwanda", "RS": "Serbia",
    "TL": "East Timor", "RE": "Reunion",
    "TM": "Turkmenistan", "TJ": "Tajikistan",
    "RO": "Romania", "TK": "Tokelau", "GW": "Guinea-Bissau",
    "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands",
    "GR": "Greece", "GQ": "Equatorial Guinea",
    "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey"
    , "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada",
    "GB": "United Kingdom", "GA": "Gabon", "SV": "El Salvador",
    "GN": "Guinea", "GM": "Gambia", "GL": "Greenland",
    "GI": "Gibraltar", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia",
    "JO": "Jordan", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary",
    "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and McDonald Islands",
    "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestinian Territory",
    "PW": "Palau", "PT": "Portugal", "SJ": "Svalbard and Jan Mayen", "PY": "Paraguay",
    "IQ": "Iraq", "PA": "Panama", "PF": "French Polynesia",
    "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines",
    "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "ZM": "Zambia",
    "EH": "Western Sahara", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa",
    "EC": "Ecuador", "IT": "Italy", "VN": "Vietnam", "SB": "Solomon Islands",
    "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "SA": "Saudi Arabia",
    "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova",
    "MG": "Madagascar", "MF": "Saint Martin", "MA": "Morocco", "MC": "Monaco",
    "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao",
    "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Macedonia",
    "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives",
    "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat",
    "MR": "Mauritania", "IM": "Isle of Man", "UG": "Uganda", "TZ": "Tanzania",
    "MY": "Malaysia", "IL": "Israel", "FR": "France",
    "IO": "British Indian Ocean Territory", "SH": "Saint Helena", "FI": "Finland",
    "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands",
    "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia",
    "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island",
    "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue",
    "CK": "Cook Islands", "XK": "Kosovo", "CI": "Ivory Coast", "CH": "Switzerland",
    "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos Islands",
    "CA": "Canada", "CG": "Republic of the Congo", "CF": "Central African Republic",
    "CD": "Democratic Republic of the Congo", "CZ": "Czech Republic", "CY": "Cyprus",
    "CX": "Christmas Island", "CR": "Costa Rica", "CW": "Curacao", "CV": "Cape Verde",
    "CU": "Cuba", "SZ": "Swaziland", "SY": "Syria", "SX": "Sint Maarten", "KG": "Kyrgyzstan",
    "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia",
    "KN": "Saint Kitts and Nevis", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia",
    "KR": "South Korea", "SI": "Slovenia", "KP": "North Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino",
    "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "KY": "Cayman Islands", "SG": "Singapore",
    "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti",
    "DK": "Denmark", "VG": "British Virgin Islands", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria",
    "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Minor Outlying Islands",
    "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Laos", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago",
    "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania",
    "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories",
    "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands", "LY": "Libya", "VA": "Vatican",
    "VC": "Saint Vincent and the Grenadines", "AE": "United Arab Emirates", "AD": "Andorra",
    "AG": "Antigua and Barbuda", "AF": "Afghanistan", "AI": "Anguilla", "VI": "U.S. Virgin Islands",
    "IS": "Iceland", "IR": "Iran", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AQ": "Antarctica",
    "AS": "American Samoa", "AR": "Argentina", "AU": "Australia", "AT": "Austria", "AW": "Aruba",
    "IN": "India", "AX": "Aland Islands", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia",
    "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique"
}
let estadosMexico = [
    {
        "id": 1,
        "name": "Aguascalientes"
    },
    {
        "id": 2,
        "name": "Baja California"
    },
    {
        "id": 3,
        "name": "Baja California Sur"
    },
    {
        "id": 4,
        "name": "Campeche"
    },
    {
        "id": 5,
        "name": "Coahuila"
    },
    {
        "id": 6,
        "name": "Colima"
    },
    {
        "id": 7,
        "name": "Chiapas"
    },
    {
        "id": 8,
        "name": "Chihuahua"
    },
    {
        "id": 9,
        "name": "Distrito Federal"
    },
    {
        "id": 10,
        "name": "Durango"
    },
    {
        "id": 11,
        "name": "Guanajuato"
    },
    {
        "id": 12,
        "name": "Guerrero"
    },
    {
        "id": 13,
        "name": "Hidalgo"
    },
    {
        "id": 14,
        "name": "Jalisco"
    },
    {
        "id": 15,
        "name": "México"
    },
    {
        "id": 16,
        "name": "Michoacán"
    },
    {
        "id": 17,
        "name": "Morelos"
    },
    {
        "id": 18,
        "name": "Nayarit"
    },
    {
        "id": 19,
        "name": "Nuevo León"
    },
    {
        "id": 20,
        "name": "Oaxaca"
    },
    {
        "id": 21,
        "name": "Puebla"
    },
    {
        "id": 22,
        "name": "Querétaro"
    },
    {
        "id": 23,
        "name": "Quintana Roo"
    },
    {
        "id": 24,
        "name": "San Luis Potosí"
    },
    {
        "id": 25,
        "name": "Sinaloa"
    },
    {
        "id": 26,
        "name": "Sonora"
    },
    {
        "id": 27,
        "name": "Tabasco"
    },
    {
        "id": 28,
        "name": "Tamaulipas"
    },
    {
        "id": 29,
        "name": "Tlaxcala"
    },
    {
        "id": 30,
        "name": "Veracruz"
    },
    {
        "id": 31,
        "name": "Yucatán"
    },
    {
        "id": 32,
        "name": "Zacatecas"
    }
]
app.get('/estados/:clave', async (req, res) => {
    let clave = req.params.clave;
    if (clave != 'MX') {
        return res.status(400).json({
            msg: 'No se encontrarón estados para este país',
            cont: {
                estadosMexico: [{ id: 'otros', name: 'otros' }]
            }
        })

    } else {
        return res.status(200).json({
            msg: 'Se obtuvieron los estados exitosamente',
            cont: {
                estadosMexico
            }
        })
    }
})


app.get('/', async (req, res) => {
    var result = [];
    for (var i in paises)
        result.push([i, paises[i]]);

    return res.status(200).json({
        msg: 'Se consulto la información correctamente',
        cont: {
            result
        }
    })
})

module.exports = app;