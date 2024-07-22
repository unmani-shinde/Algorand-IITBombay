import beaker as bk
import pyteal as pt

class CIDState:
    SCID = bk.GlobalStateValue(pt.TealType.bytes)
    TCID = bk.GlobalStateValue(pt.TealType.bytes)

app = bk.Application("SCID_app", state = CIDState())

@app.external
def update_SCID(cid: pt.abi.String) -> pt.Expr:
        return app.state.SCID.set(cid.get())

@app.external
def read_cids(*, output: pt.abi.String) -> pt.Expr:
        return output.set(app.state.SCID)

@app.external
def update_TCID(cid: pt.abi.String) -> pt.Expr:
        return app.state.TCID.set(cid.get())

@app.external
def read_tcid(*, output: pt.abi.String) -> pt.Expr:
        return output.set(app.state.TCID)

if __name__ == "__main__":
    spec = app.build()
    spec.export("artifacts")
    print("global states:\n", spec.schema)