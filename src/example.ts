const test_block = [
    {
    "from_address": "0x5460ddee442f8b0f019bfadb501628779f8201eb18d5f03c451a60d25a2814b",
    "keys": [
    "1357314799866472850228098563329486876231194924346860544729534492575199005676"
    ],
    "data": [
    "1",
    "2",
    "3",
    "62110",
    "1644239682",
    "284384004099240175754881646571667082286693825255651537813919063488354881855",
    "133132579687906840835451294270773411042780769325889400915569837285550233407",
    "2069788"
    ]
    }
]

function extract_sig(block) {
    // Sanity check for incoming block
    if (!block || block.length < 1 || !block[0].data || block[0].data.length < 8) {
        return ""
    }
    let part1 = block[0].data[5]
    let part2 = block[0].data[6]
    let part3 = block[0].data[7]
    return "0x" + BigInt(part1).toString(16) + BigInt(part2).toString(16) + BigInt(part3).toString(16)
}
