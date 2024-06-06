import beaker as bk
import pyteal as pt

class CIDState:
    cids = bk.GlobalStateValue(pt.TealType.bytes)

app = bk.Application("CID", state = CIDState())

@app.external
def add_cid(cid: pt.abi.DynamicBytes) -> pt.Expr:
        return pt.Seq([
            pt.If(
                pt.Len(pt.App.globalGet(pt.Bytes("cids"))) > pt.Int(0),
                # If not empty, append with a delimiter
                pt.App.globalPut(pt.Bytes("cids"), pt.Concat(pt.App.globalGet(pt.Bytes("cids")), pt.Bytes("|"), cid.get())),
                # If empty, just set the new CID
                pt.App.globalPut(pt.Bytes("cids"), cid.get())
            ),
            pt.Approve(),
        ])

@app.external
def read_cids(*, output: pt.abi.DynamicBytes) -> pt.Expr:
        # Join all CIDs with a delimiter for output (or use a loop to handle differently)
        return output.set(app.state.cids)

if __name__ == "__main__":
    spec = app.build()
    spec.export("artifacts")
