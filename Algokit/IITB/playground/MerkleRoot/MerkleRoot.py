# Sample Hello World Beaker smart contract - the most basic starting point for an Algorand smart contract
import beaker
import pyteal as pt

app = beaker.Application("MerkleRoot")


@app.external
def MerkleRoot(name: pt.abi.String, *, output: pt.abi.String) -> pt.Expr:
    return output.set(pt.Concat(pt.Bytes("0535c1e0c70e47b7f6e88b64b2608771d320813af15636f2f7ef7dd27cb821ec, "), name.get()))



#dynamic proofs


