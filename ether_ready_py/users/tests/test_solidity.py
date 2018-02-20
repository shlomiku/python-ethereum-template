from test_plus.test import TestCase
import logging, sys
logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)
from web3 import Web3, HTTPProvider, TestRPCProvider, EthereumTesterProvider
from solc import compile_source
from web3.contract import ConciseContract

logger = logging.getLogger('.'.join(__file__.split('/')[-2:]).rstrip('.py'))


class TestSimpleSildityContract(TestCase):
    def setUp(self):
        # call BaseUserTestCase.setUp()
        self.contract_source_code = '''
                    pragma solidity ^0.4.0;

                    contract Greeter {
                        string public greeting;

                        function Greeter() {
                            greeting = 'Hello there';
                        }

                        function setGreeting(string _greeting) public {
                            greeting = _greeting;
                        }

                        function greet() constant returns (string) {
                            return greeting;
                        }
                    }
                    '''
        compiled_sol = compile_source(self.contract_source_code)  # Compiled source code
        self.contract_interface = compiled_sol['<stdin>:Greeter']

        # web3.py instance
        self.w3 = Web3(EthereumTesterProvider())
        # Instantiate and deploy contract
        self.contract = self.w3.eth.contract(abi=self.contract_interface['abi'], bytecode=self.contract_interface['bin'])
        # Get transaction hash from deployed contract
        self.tx_hash = self.contract.deploy(transaction={'from': self.w3.eth.accounts[0], 'gas': 410000})
        # Get tx receipt to get contract address

    def test_make_sure_contract_is_deployed(self):
        """
        this test deploys a contract to the test provider, then checks that the transaction
        :return:
        """
        tx_receipt = self.w3.eth.getTransactionReceipt(self.tx_hash)
        contract_address = tx_receipt['contractAddress']
        print(contract_address)
        self.assertTrue(contract_address)

    def test_check_generated_accounts(self):
        """
        the web3 instance generates accounts for us, this test will verify it
        :return:
        """
        self.assertTrue(self.w3.eth.accounts)
        self.assertEqual(len(self.w3.eth.accounts), 10)

    def test_check_default_message(self):
        """
        this test checks the default message in the deployed contract
        :return:
        """
        # Contract instance in concise mode
        tx_receipt = self.w3.eth.getTransactionReceipt(self.tx_hash)
        contract_address = tx_receipt['contractAddress']
        contract_instance = self.w3.eth.contract(self.contract_interface['abi'], contract_address,
                                            ContractFactoryClass=ConciseContract)
        self.assertEqual('Hello there', contract_instance.greeting())
        # we are using the ContractFactoryClass=ConciseContract, which is a unique factory for ease of use and
        # maybe stuff I don't fully understand yet.
        # this is the convetional way to use it
        # contract_instance = self.w3.eth.contract(self.contract_interface['abi'], contract_address)
        # contract_instance.call().greeting()

    def test_check_set_message(self):
        """
        this test checks that we can set a message
        :return:
        """
        # Contract instance in concise mode
        tx_receipt = self.w3.eth.getTransactionReceipt(self.tx_hash)
        contract_address = tx_receipt['contractAddress']
        contract_instance = self.w3.eth.contract(self.contract_interface['abi'], contract_address,
                                                 ContractFactoryClass=ConciseContract)
        contract_instance.setGreeting('hello shlomi', transact={'from': self.w3.eth.accounts[0]})
        self.assertEqual('hello shlomi', contract_instance.greeting())
        # we are using the ContractFactoryClass=ConciseContract, which is a unique factory for ease of use and
        # maybe stuff I don't fully understand yet. this is the convetional way to use it
        # contract_instance = self.w3.eth.contract(self.contract_interface['abi'], contract_address)
        # contract_instance.transact({'from': self.w3.eth.accounts[0]}).setGreeting("what's up")




