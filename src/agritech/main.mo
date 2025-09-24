import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

actor AgriTrace {
  type ProduceId = Nat;
  type Stakeholder = Text; // Remains Text (can hold phone number as string)
  type Produce = {
    id: ProduceId;
    produceType: Text;
    origin: Text;
    quality: Text;
    price: Nat;
    currentOwner: Stakeholder;
    registeredTime: Time.Time;
    history: [Transaction];
  };

  type Transaction = {
    timestamp: Time.Time;
    from: ?Stakeholder;
    to: Stakeholder;
    details: Text;
  };

  stable var nextId: ProduceId = 0;

  // Stable storage for produces HashMap
  stable var producesEntries : [(ProduceId, Produce)] = [];
  let produces = HashMap.HashMap<ProduceId, Produce>(0, Nat.equal, func(n: Nat): Hash.Hash { Text.hash(Nat.toText(n)) });

  // System hooks for upgrading canister (persists HashMap)
  system func preupgrade() {
    producesEntries := Iter.toArray(produces.entries());
  };

  system func postupgrade() {
    for ((k, v) in producesEntries.vals()) {
      produces.put(k, v);
    };
    producesEntries := [];
  };

  // Farmer registers produce (now pass currentOwner)
  public func addProduce(produceType: Text, origin: Text, quality: Text, price: Nat, currentOwner: Text) : async Result.Result<ProduceId, Text> {
    let id = nextId;
    nextId += 1;
    let initialTx: Transaction = {
      timestamp = Time.now();
      from = null;
      to = currentOwner;
      details = "Produce registered by farmer";
    };
    let produce: Produce = {
      id;
      produceType;
      origin;
      quality;
      price;
      currentOwner;
      registeredTime = Time.now();
      history = [initialTx];
    };
    produces.put(id, produce);
    #ok(id);
  };

  // Transfer ownership (now pass 'from' for ownership check)
  public func transferProduce(id: ProduceId, from: Text, newOwner: Text, details: Text, newPrice: Nat) : async Result.Result<Text, Text> {
    switch (produces.get(id)) {
      case (?produce) {
        if (produce.currentOwner != from) {
          return #err("Not the current owner");
        };
        let newTx: Transaction = {
          timestamp = Time.now();
          from = ?from;
          to = newOwner;
          details;
        };
        let newHistory: [Transaction] = Array.tabulate(produce.history.size() + 1, func(i: Nat) : Transaction {
          if (i < produce.history.size()) { produce.history[i] } else { newTx }
        });
        let updatedProduce: Produce = {
          id = produce.id;
          produceType = produce.produceType;
          origin = produce.origin;
          quality = produce.quality;
          price = newPrice;
          currentOwner = newOwner;
          registeredTime = produce.registeredTime;
          history = newHistory;
        };
        produces.put(id, updatedProduce);
        #ok("Transfer successful");
      };
      case null #err("Produce not found");
    };
  };

  // Query produce trace
  public query func getProduceTrace(id: ProduceId) : async ?Produce {
    produces.get(id);
  };

  // Get all produce
  public query func getAllProduces() : async [Produce] {
    Iter.toArray(produces.vals());
  };

  // Get produces by owner
  public query func getProducesByOwner(owner: Text) : async [Produce] {
    let result = Array.filter<Produce>(Iter.toArray(produces.vals()), func(produce) {
      produce.currentOwner == owner
    });
    result;
  };

  // Verify stakeholder in history
  public query func verifyStakeholderInTrace(id: ProduceId, stakeholder: Text) : async Bool {
    switch (produces.get(id)) {
      case (?produce) {
        switch (Array.find<Transaction>(produce.history, func(tx) {
          tx.to == stakeholder or (switch(tx.from) { case (?f) f == stakeholder; case null false; })
        })) {
          case (?_) true;
          case null false;
        };
      };
      case null false;
    };
  };
};

