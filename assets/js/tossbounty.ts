export type Tossbounty = {
  "version": "0.1.0",
  "name": "tossbounty",
  "instructions": [
    {
      "name": "createBountyExample",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bounty",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programId",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "org",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claimBountyExample",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "whitehatTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bounty",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programId",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "bounty",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "org",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": "BountyStatus"
            }
          },
          {
            "name": "fundingAccount",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "programId",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "BountyStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Unclaimed"
          },
          {
            "name": "Claimed"
          },
          {
            "name": "Canceled"
          }
        ]
      }
    }
  ]
};

export const IDL: Tossbounty = {
  "version": "0.1.0",
  "name": "tossbounty",
  "instructions": [
    {
      "name": "createBountyExample",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bounty",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programId",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "org",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claimBountyExample",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "whitehatTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bounty",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programId",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "bounty",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "org",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": "BountyStatus"
            }
          },
          {
            "name": "fundingAccount",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "programId",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "BountyStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Unclaimed"
          },
          {
            "name": "Claimed"
          },
          {
            "name": "Canceled"
          }
        ]
      }
    }
  ]
};
