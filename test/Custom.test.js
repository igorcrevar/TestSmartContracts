const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Custom", function () {
    let Custom;
    let custom;
    let owner, other;

    beforeEach(async function () {
        [owner, other] = await ethers.getSigners();

        Custom = await ethers.getContractFactory("Custom");
        custom = await upgrades.deployProxy(Custom, [], {
            initializer: "initialize",
        });
        await custom.waitForDeployment();
    });

    it("should initialize with correct owner", async function () {
        expect(await custom.owner()).to.equal(owner.address);
    });

    it("should allow owner to add a custom item", async function () {
        const items = [
            {
                name: "Test Item",
                value: 123,
                isActive: true,
                phone: "061"
            },
            {
                name: "Test Item2",
                value: 80000,
                isActive: false,
                phone: ""
            },
        ];

        for (let item of items) {
            await expect(custom.addCustomItem(item)).to.not.be.reverted;
        }

        let indx = 0;
        const storedItems = await custom.getCustomItems();
        for (let storedItem of storedItems) {
            expect(storedItem.name).to.equal(items[indx].name);
            expect(storedItem.value).to.equal(items[indx].value);
            expect(storedItem.isDoneSwitch).to.equal(items[indx].isDoneSwitch);
            indx++;
        }
    });

    it("should revert if non-owner tries to add a custom item", async function () {
        const item = {
            name: "Invalid",
            value: 1,
            isActive: false,
            phone: ""            
        };

        await expect(
            custom.connect(other).addCustomItem(item)
        ).to.be.reverted;
    });

    it("should allow owner to upgrade the contract", async function () {
        const CustomV2 = await ethers.getContractFactory("Custom");
        const upgraded = await upgrades.upgradeProxy(custom, CustomV2);
        expect(await upgraded.owner()).to.equal(owner.address);
    });

    it("console log ee", function () {
        const iface = Custom.interface;
        const data = iface.encodeFunctionData("addCustomItem", [
            {
                name: "First",
                value: 42,
                isActive: true,
                phone: "061"
            },
        ]);

        console.log("Encoded calldata:", data);

        const data2 = iface.encodeFunctionData("getCustomItems");

        console.log("Encoded calldata:", data2);
    })
});
